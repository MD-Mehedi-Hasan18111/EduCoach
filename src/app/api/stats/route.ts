import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Tenant } from "@/models/Tenant";
import { RegistrationRequest } from "@/models/RegistrationRequest";
import { Subscription } from "@/models/Subscription";
import { Invoice } from "@/models/Invoice";
import { ActivityLog } from "@/models/ActivityLog";
import { requireSuperAdmin } from "@/lib/auth-helper";

export async function GET(request: NextRequest) {
  try {
    const { errorResponse } = requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    await connectToDatabase();

    const [
      totalSystems,
      activeSystems,
      maintenanceSystems,
      suspendedSystems,
      pendingRequests,
      approvedRequests,
      activeSubscriptions,
      invoices,
      recentLogs,
    ] = await Promise.all([
      Tenant.countDocuments(),
      Tenant.countDocuments({ status: "ACTIVE" }),
      Tenant.countDocuments({ status: "MAINTENANCE" }),
      Tenant.countDocuments({ status: "SUSPENDED" }),
      RegistrationRequest.countDocuments({ status: "PENDING" }),
      RegistrationRequest.countDocuments({ status: "APPROVED" }),
      Subscription.countDocuments({ status: "ACTIVE" }),
      Invoice.find({ status: "PAID" }),
      ActivityLog.find().sort({ createdAt: -1 }).limit(10),
    ]);

    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalSystems,
        activeSystems,
        maintenanceSystems,
        suspendedSystems,
        pendingRequests,
        approvedRequests,
        activeSubscriptions,
        totalRevenue,
      },
      recentLogs,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

