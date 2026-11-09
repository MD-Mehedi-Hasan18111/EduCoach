import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Tenant } from "@/models/Tenant";
import { Subscription } from "@/models/Subscription";
import { Admin } from "@/models/Admin";
import { ActivityLog } from "@/models/ActivityLog";
import { requireSuperAdmin } from "@/lib/auth-helper";

// GET /api/systems/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    await connectToDatabase();

    const tenant = await Tenant.findById(id);
    if (!tenant) {
      return NextResponse.json({ success: false, error: "System not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, system: tenant });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/systems/[id]: Update system details
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse, session } = requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await request.json();

    await connectToDatabase();

    const tenant = await Tenant.findById(id);
    if (!tenant) {
      return NextResponse.json({ success: false, error: "System not found." }, { status: 404 });
    }

    // Editable fields
    if (body.name) tenant.name = body.name.trim();
    if (body.systemUrl) tenant.systemUrl = body.systemUrl.trim();
    if (body.databaseName) tenant.databaseName = body.databaseName.trim();
    if (body.mongoUri !== undefined) tenant.mongoUri = body.mongoUri.trim();
    if (body.logoUrl !== undefined) tenant.logoUrl = body.logoUrl.trim();
    if (body.tagline !== undefined) tenant.tagline = body.tagline.trim();
    if (body.facebookUrl !== undefined) tenant.facebookUrl = body.facebookUrl.trim();
    if (body.youtubeUrl !== undefined) tenant.youtubeUrl = body.youtubeUrl.trim();
    if (body.websiteUrl !== undefined) tenant.websiteUrl = body.websiteUrl.trim();
    if (body.batchTypes !== undefined) tenant.batchTypes = Array.isArray(body.batchTypes) ? body.batchTypes : [];
    if (body.description !== undefined) tenant.description = body.description.trim();
    if (body.ownerName) tenant.ownerName = body.ownerName.trim();
    if (body.ownerEmail) tenant.ownerEmail = body.ownerEmail.toLowerCase().trim();
    if (body.ownerPhone) tenant.ownerPhone = body.ownerPhone.trim();
    if (body.planCode) tenant.planCode = body.planCode;
    if (body.subscriptionStatus) tenant.subscriptionStatus = body.subscriptionStatus;
    if (body.subscriptionExpiresAt) tenant.subscriptionExpiresAt = new Date(body.subscriptionExpiresAt);
    if (body.features) tenant.features = { ...tenant.features, ...body.features };
    if (body.notes !== undefined) tenant.notes = body.notes;

    await tenant.save();

    // Sync admin record systemUrl if changed
    if (body.systemUrl) {
      await Admin.updateMany(
        { coachingSlug: tenant.slug },
        { $set: { systemUrl: tenant.systemUrl } }
      );
    }

    // Sync active subscription if plan or expiration changed
    if (body.planCode || body.subscriptionStatus || body.subscriptionExpiresAt) {
      await Subscription.findOneAndUpdate(
        { tenantId: tenant._id, status: "ACTIVE" },
        {
          $set: {
            planCode: tenant.planCode,
            status: tenant.subscriptionStatus,
            endDate: tenant.subscriptionExpiresAt,
          },
        }
      );
    }

    await ActivityLog.create({
      action: "SYSTEM_UPDATED",
      category: "SYSTEM_ACCESS",
      performedBy: session?.name || "SUPER_ADMIN",
      tenantSlug: tenant.slug,
      tenantName: tenant.name,
      details: `Updated settings and configuration for '${tenant.name}'`,
    });

    return NextResponse.json({
      success: true,
      message: "Coaching system updated successfully.",
      system: tenant,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/systems/[id]: Remove coaching system
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse, session } = requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    await connectToDatabase();

    const tenant = await Tenant.findById(id);
    if (!tenant) {
      return NextResponse.json({ success: false, error: "System not found." }, { status: 404 });
    }

    const { name, slug } = tenant;
    await Tenant.findByIdAndDelete(id);

    await ActivityLog.create({
      action: "SYSTEM_DELETED",
      category: "SECURITY",
      performedBy: session?.name || "SUPER_ADMIN",
      tenantSlug: slug,
      tenantName: name,
      details: `Deleted coaching system '${name}' (${slug})`,
    });

    return NextResponse.json({
      success: true,
      message: `Coaching system '${name}' removed.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

