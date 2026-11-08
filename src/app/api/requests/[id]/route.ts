import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { RegistrationRequest } from "@/models/RegistrationRequest";
import { Tenant } from "@/models/Tenant";
import { Subscription } from "@/models/Subscription";
import { Invoice } from "@/models/Invoice";
import { Plan } from "@/models/Plan";
import { ActivityLog } from "@/models/ActivityLog";
import { requireSuperAdmin } from "@/lib/auth-helper";
import { generateLicenseKey } from "@/lib/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse, session } = requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await request.json();
    const { action, systemUrl, databaseName, mongoUri, initialPassword, rejectionReason, notes } =
      body;

    await connectToDatabase();

    const regRequest = await RegistrationRequest.findById(id);
    if (!regRequest) {
      return NextResponse.json({ success: false, error: "Request not found." }, { status: 404 });
    }

    if (action === "REJECT") {
      regRequest.status = "REJECTED";
      regRequest.rejectionReason = rejectionReason || "Application did not meet criteria.";
      regRequest.reviewedAt = new Date();
      regRequest.reviewedBy = session?.name || "SUPER_ADMIN";
      await regRequest.save();

      await ActivityLog.create({
        action: "REQUEST_REJECTED",
        category: "ONBOARDING",
        performedBy: session?.name || "SUPER_ADMIN",
        tenantSlug: regRequest.requestedSlug,
        tenantName: regRequest.coachingName,
        details: `Registration rejected for '${regRequest.coachingName}'. Reason: ${regRequest.rejectionReason}`,
      });

      return NextResponse.json({
        success: true,
        message: "Registration request rejected.",
        request: regRequest,
      });
    }

    if (action === "APPROVE") {
      // 1. Live website URL MUST be provided by the Master Admin (no auto-generated fake URLs)
      if (!systemUrl || !systemUrl.trim()) {
        return NextResponse.json(
          { success: false, error: "Live coaching website URL is required. Please provide the Vercel or custom domain URL." },
          { status: 400 }
        );
      }
      const finalSystemUrl = systemUrl.trim();
      const finalDbName =
        databaseName?.trim() || `${regRequest.requestedSlug}_coaching_db`;
      const licenseKey = generateLicenseKey(regRequest.requestedSlug);

      // 2. Hash initial portal password
      const rawPassword = initialPassword || "EduCoach@123";
      const portalPasswordHash = await bcrypt.hash(rawPassword, 10);

      // 3. Find plan details
      const plan = await Plan.findOne({ code: regRequest.planCode });
      const amount =
        regRequest.planCode === "FREE"
          ? 0
          : regRequest.billingCycle === "YEARLY"
          ? plan?.priceYearly || 0
          : plan?.priceMonthly || 0;

      const now = new Date();
      const expiresAt = new Date();
      if (regRequest.billingCycle === "YEARLY") {
        expiresAt.setFullYear(now.getFullYear() + 1);
      } else {
        expiresAt.setMonth(now.getMonth() + 1);
      }

      // 4. Create Tenant
      const tenant = await Tenant.create({
        name: regRequest.coachingName,
        slug: regRequest.requestedSlug,
        status: "ACTIVE",
        systemUrl: finalSystemUrl,
        databaseName: finalDbName,
        mongoUri: mongoUri || `mongodb://127.0.0.1:27017/${finalDbName}`,
        ownerName: regRequest.directorName,
        ownerEmail: regRequest.email,
        ownerPhone: regRequest.phone,
        portalPasswordHash,
        planCode: regRequest.planCode,
        subscriptionStatus: "ACTIVE",
        subscriptionExpiresAt: expiresAt,
        licenseKey,
        features: plan?.features || {
          smsAlerts: false,
          onlineAdmission: true,
          examPortal: true,
          accountsManagement: true,
          customDomain: false,
          reportsDownload: true,
        },
        notes: notes || `Auto-provisioned from request ${regRequest.referenceCode}`,
        lastPingStatus: "UNKNOWN",
      });

      // 5. Create initial subscription
      const subscription = await Subscription.create({
        tenantId: tenant._id,
        coachingName: tenant.name,
        planCode: tenant.planCode,
        billingCycle: regRequest.billingCycle,
        startDate: now,
        endDate: expiresAt,
        amount,
        status: "ACTIVE",
        autoRenew: true,
        notes: `Initial provisioning for request ${regRequest.referenceCode}`,
      });

      // 6. Create initial invoice
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;
      await Invoice.create({
        invoiceNumber,
        tenantId: tenant._id,
        coachingName: tenant.name,
        ownerEmail: tenant.ownerEmail,
        amount,
        currency: "BDT",
        status: amount === 0 ? "PAID" : "PENDING",
        paidAt: amount === 0 ? now : undefined,
        billingPeriod: amount === 0 ? "Free MVP Tier (Lifetime)" : `${regRequest.billingCycle} Subscription (${now.toLocaleDateString()} - ${expiresAt.toLocaleDateString()})`,
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days grace
        notes: amount === 0 ? "Free MVP enrollment" : "Initial license invoice pending confirmation",
      });

      // 7. Update Request Status
      regRequest.status = "APPROVED";
      regRequest.assignedTenantId = tenant._id;
      regRequest.assignedSystemUrl = finalSystemUrl;
      regRequest.reviewedAt = now;
      regRequest.reviewedBy = session?.name || "SUPER_ADMIN";
      await regRequest.save();

      // 8. Log Activity
      await ActivityLog.create({
        action: "REQUEST_APPROVED",
        category: "ONBOARDING",
        performedBy: session?.name || "SUPER_ADMIN",
        tenantSlug: tenant.slug,
        tenantName: tenant.name,
        details: `Approved registration request ${regRequest.referenceCode}. Created tenant '${tenant.name}' with license key ${licenseKey}`,
      });

      return NextResponse.json({
        success: true,
        message: "Registration approved and new coaching system provisioned!",
        tenant,
        initialPassword: rawPassword,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("Review request error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

