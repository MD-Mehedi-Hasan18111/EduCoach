import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Subscription } from "@/models/Subscription";
import { Tenant } from "@/models/Tenant";
import { Invoice } from "@/models/Invoice";
import { Plan } from "@/models/Plan";
import { ActivityLog } from "@/models/ActivityLog";
import { getSessionFromRequest, requireSuperAdmin } from "@/lib/auth-helper";

// GET /api/subscriptions: List subscriptions (Super Admin sees all, Tenant Owner sees their own)
export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const query: any = {};
    if (session.role === "TENANT_OWNER") {
      query.tenantId = session.tenantId;
    }

    const subscriptions = await Subscription.find(query)
      .populate("tenantId", "name slug systemUrl status")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      subscriptions,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/subscriptions: Renew or create subscription for tenant
export async function POST(request: NextRequest) {
  try {
    const { errorResponse, session } = requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { tenantId, planCode, billingCycle, durationMonths = 12, amount, notes } = body;

    if (!tenantId || !planCode) {
      return NextResponse.json(
        { success: false, error: "Tenant and plan are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return NextResponse.json({ success: false, error: "Tenant not found." }, { status: 404 });
    }

    const plan = await Plan.findOne({ code: planCode });
    const finalAmount =
      amount !== undefined
        ? Number(amount)
        : billingCycle === "YEARLY"
        ? plan?.priceYearly || 29990
        : plan?.priceMonthly || 2999;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + Number(durationMonths));

    const subscription = await Subscription.create({
      tenantId: tenant._id,
      coachingName: tenant.name,
      planCode,
      billingCycle: billingCycle || "YEARLY",
      startDate,
      endDate,
      amount: finalAmount,
      status: "ACTIVE",
      autoRenew: true,
      notes: notes || "Manual subscription extension",
    });

    // Update tenant subscription status & validity
    tenant.planCode = planCode;
    tenant.subscriptionStatus = "ACTIVE";
    tenant.subscriptionExpiresAt = endDate;
    if (plan?.features) {
      tenant.features = plan.features;
    }
    await tenant.save();

    // Create corresponding invoice
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    await Invoice.create({
      invoiceNumber,
      tenantId: tenant._id,
      coachingName: tenant.name,
      ownerEmail: tenant.ownerEmail,
      amount: finalAmount,
      currency: "BDT",
      status: "PAID",
      paymentMethod: "MANUAL",
      billingPeriod: `${billingCycle} Renewal`,
      dueDate: startDate,
      paidAt: startDate,
      notes: `Subscription renewed by Admin (${session?.name})`,
    });

    await ActivityLog.create({
      action: "SUBSCRIPTION_RENEWED",
      category: "SUBSCRIPTION",
      performedBy: session?.name || "SUPER_ADMIN",
      tenantSlug: tenant.slug,
      tenantName: tenant.name,
      details: `Renewed plan '${planCode}' until ${endDate.toISOString().split("T")[0]} for ${tenant.name}.`,
    });

    return NextResponse.json({
      success: true,
      message: `Subscription successfully renewed for '${tenant.name}'!`,
      subscription,
      expiresAt: endDate,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

