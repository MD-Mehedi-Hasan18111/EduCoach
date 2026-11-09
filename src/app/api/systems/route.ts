import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { autoSeedMasterDatabase } from "@/lib/auto-seed";
import { Tenant } from "@/models/Tenant";
import { Plan } from "@/models/Plan";
import { ActivityLog } from "@/models/ActivityLog";
import { requireSuperAdmin } from "@/lib/auth-helper";
import { generateLicenseKey, slugify } from "@/lib/utils";

// GET /api/systems: List all registered coaching systems
export async function GET(request: NextRequest) {
  try {
    const { errorResponse } = requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    await connectToDatabase();
    await autoSeedMasterDatabase();
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");

    const query: any = {};
    if (status && status !== "ALL") {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { ownerEmail: { $regex: search, $options: "i" } },
      ];
    }

    const systems = await Tenant.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: systems.length,
      systems,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/systems: Manually register a coaching system
export async function POST(request: NextRequest) {
  try {
    const { errorResponse, session } = requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const {
      name,
      slug,
      logoUrl,
      tagline,
      establishedYear,
      facebookUrl,
      youtubeUrl,
      websiteUrl,
      batchTypes,
      description,
      systemUrl,
      databaseName,
      mongoUri,
      ownerName,
      ownerEmail,
      ownerPhone,
      portalPassword,
      planCode = "FREE",
      subscriptionMonths = 12,
      features,
      notes,
    } = body;

    if (!name || !systemUrl || !ownerName || !ownerEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (Name, System URL, Director Name, Director Email are required)." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    await autoSeedMasterDatabase();
    let cleanSlug = slugify(slug || name, "coaching");

    const existing = await Tenant.findOne({ slug: cleanSlug });
    if (existing) {
      cleanSlug = `${cleanSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const rawPassword = portalPassword || "coaching123";
    const portalPasswordHash = await bcrypt.hash(rawPassword, 10);

    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setMonth(now.getMonth() + Number(subscriptionMonths));

    const licenseKey = generateLicenseKey(cleanSlug);

    const plan = await Plan.findOne({ code: planCode });

    const tenant = await Tenant.create({
      name: name.trim(),
      slug: cleanSlug,
      logoUrl: logoUrl?.trim() || "",
      tagline: tagline?.trim() || "",
      establishedYear: establishedYear?.trim() || "",
      facebookUrl: facebookUrl?.trim() || "",
      youtubeUrl: youtubeUrl?.trim() || "",
      websiteUrl: websiteUrl?.trim() || "",
      batchTypes: Array.isArray(batchTypes) ? batchTypes : [],
      description: description?.trim() || "",
      status: "ACTIVE",
      systemUrl: systemUrl.trim(),
      databaseName: databaseName?.trim() || "",
      mongoUri: mongoUri?.trim() || "",
      ownerName: ownerName.trim(),
      ownerEmail: ownerEmail.toLowerCase().trim(),
      ownerPhone: ownerPhone?.trim() || "",
      portalPasswordHash,
      planCode,
      subscriptionStatus: "ACTIVE",
      subscriptionExpiresAt: expiresAt,
      licenseKey,
      features: features || plan?.features || {
        smsAlerts: false,
        onlineAdmission: true,
        examPortal: true,
        accountsManagement: true,
        customDomain: false,
        reportsDownload: true,
      },
      notes: notes || "Manually created via EduCoach Master Admin.",
    });

    await ActivityLog.create({
      action: "SYSTEM_CREATED",
      category: "SYSTEM_ACCESS",
      performedBy: session?.name || "SUPER_ADMIN",
      tenantSlug: tenant.slug,
      tenantName: tenant.name,
      details: `Manually added coaching system '${tenant.name}' (${tenant.slug}) with URL ${tenant.systemUrl}`,
    });

    return NextResponse.json({
      success: true,
      message: "Coaching system registered successfully!",
      system: tenant,
      initialPortalPassword: rawPassword,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

