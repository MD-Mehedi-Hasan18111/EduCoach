import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Tenant, TenantStatus } from "@/models/Tenant";
import { ActivityLog } from "@/models/ActivityLog";
import { requireSuperAdmin } from "@/lib/auth-helper";

// POST /api/systems/[id]/accessibility: Change access state
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse, session } = requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await request.json();
    const { status, reason } = body;

    const validStatuses: TenantStatus[] = ["ACTIVE", "SUSPENDED", "MAINTENANCE", "PENDING_SETUP"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const tenant = await Tenant.findById(id);
    if (!tenant) {
      return NextResponse.json({ success: false, error: "System not found." }, { status: 404 });
    }

    const previousStatus = tenant.status;
    tenant.status = status;

    if (status === "MAINTENANCE") {
      tenant.maintenanceReason = reason || "Scheduled system maintenance in progress.";
    } else if (status === "SUSPENDED") {
      tenant.suspensionReason = reason || "Subscription expired or administrative hold.";
    } else if (status === "ACTIVE") {
      tenant.maintenanceReason = "";
      tenant.suspensionReason = "";
    }

    await tenant.save();

    await ActivityLog.create({
      action: `STATUS_CHANGED_TO_${status}`,
      category: "SYSTEM_ACCESS",
      performedBy: session?.name || "SUPER_ADMIN",
      tenantSlug: tenant.slug,
      tenantName: tenant.name,
      details: `Accessibility status changed from ${previousStatus} to ${status}. ${reason ? `Reason: ${reason}` : ""}`,
    });

    return NextResponse.json({
      success: true,
      message: `System '${tenant.name}' accessibility updated to ${status}.`,
      system: tenant,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

