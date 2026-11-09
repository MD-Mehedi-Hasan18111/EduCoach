import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { RegistrationRequest } from "@/models/RegistrationRequest";
import { Tenant } from "@/models/Tenant";
import { ActivityLog } from "@/models/ActivityLog";
import { generateReferenceCode, slugify } from "@/lib/utils";
import { requireSuperAdmin } from "@/lib/auth-helper";

// Public: Submit a new coaching center registration request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      coachingName,
      requestedSlug,
      logoUrl,
      tagline,
      establishedYear,
      facebookUrl,
      youtubeUrl,
      websiteUrl,
      batchTypes,
      description,
      directorName,
      email,
      phone,
      address,
      city,
      estimatedStudents,
      planCode = "FREE",
      billingCycle = "YEARLY",
      customRequirements,
    } = body;

    if (!coachingName || !directorName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Coaching Name, Director Name, Email and Phone are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let normalizedSlug = slugify(requestedSlug || coachingName, "coaching");

    // If slug is already taken in active tenants, append a short unique suffix so request succeeds
    const existingTenant = await Tenant.findOne({ slug: normalizedSlug });
    if (existingTenant) {
      normalizedSlug = `${normalizedSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const referenceCode = generateReferenceCode("REQ");

    const newRequest = await RegistrationRequest.create({
      referenceCode,
      coachingName: coachingName.trim(),
      requestedSlug: normalizedSlug,
      logoUrl: logoUrl?.trim() || "",
      tagline: tagline?.trim() || "",
      establishedYear: establishedYear?.trim() || "",
      facebookUrl: facebookUrl?.trim() || "",
      youtubeUrl: youtubeUrl?.trim() || "",
      websiteUrl: websiteUrl?.trim() || "",
      batchTypes: Array.isArray(batchTypes) ? batchTypes : [],
      description: description?.trim() || "",
      directorName: directorName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      address: address?.trim() || "",
      city: city?.trim() || "",
      estimatedStudents: Number(estimatedStudents) || 100,
      planCode,
      billingCycle,
      customRequirements: customRequirements?.trim() || "",
      status: "PENDING",
    });

    await ActivityLog.create({
      action: "NEW_ONBOARDING_REQUEST",
      category: "ONBOARDING",
      performedBy: "PUBLIC_REGISTRATION",
      tenantSlug: normalizedSlug,
      tenantName: coachingName,
      details: `New registration request submitted by ${directorName} (${email}) for '${coachingName}'. Reference: ${referenceCode}`,
    });

    return NextResponse.json({
      success: true,
      message: "Coaching Center registration request submitted successfully!",
      request: {
        id: newRequest._id,
        referenceCode: newRequest.referenceCode,
        coachingName: newRequest.coachingName,
        requestedSlug: newRequest.requestedSlug,
        status: newRequest.status,
        createdAt: newRequest.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Registration request error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit registration request." },
      { status: 500 }
    );
  }
}

// Admin: Get all registration requests
export async function GET(request: NextRequest) {
  try {
    const { errorResponse } = requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    await connectToDatabase();
    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    const query: any = {};
    if (status && status !== "ALL") {
      query.status = status;
    }

    const requests = await RegistrationRequest.find(query).sort({ createdAt: -1 });

    const [pendingCount, approvedCount, rejectedCount, totalCount] = await Promise.all([
      RegistrationRequest.countDocuments({ status: "PENDING" }),
      RegistrationRequest.countDocuments({ status: "APPROVED" }),
      RegistrationRequest.countDocuments({ status: "REJECTED" }),
      RegistrationRequest.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      count: requests.length,
      counts: {
        PENDING: pendingCount,
        APPROVED: approvedCount,
        REJECTED: rejectedCount,
        ALL: totalCount,
      },
      requests,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

