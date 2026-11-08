import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { RegistrationRequest } from "@/models/RegistrationRequest";
import { Tenant } from "@/models/Tenant";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Please provide a reference code or email address." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Match either referenceCode or email (case-insensitive)
    const requests = await RegistrationRequest.find({
      $or: [
        { referenceCode: query.toUpperCase() },
        { email: query.toLowerCase() },
      ],
    }).sort({ createdAt: -1 });

    if (!requests || requests.length === 0) {
      return NextResponse.json(
        { success: false, error: "No registration requests found matching your query." },
        { status: 404 }
      );
    }

    // If approved, fetch tenant info
    const enrichedResults = await Promise.all(
      requests.map(async (req) => {
        let tenantInfo = null;
        if (req.assignedTenantId) {
          const tenant = await Tenant.findById(req.assignedTenantId).select(
            "name slug systemUrl status subscriptionStatus subscriptionExpiresAt"
          );
          if (tenant) {
            tenantInfo = tenant;
          }
        }
        return {
          referenceCode: req.referenceCode,
          coachingName: req.coachingName,
          requestedSlug: req.requestedSlug,
          directorName: req.directorName,
          email: req.email,
          status: req.status,
          planCode: req.planCode,
          billingCycle: req.billingCycle,
          createdAt: req.createdAt,
          reviewedAt: req.reviewedAt,
          rejectionReason: req.rejectionReason,
          assignedSystemUrl: req.assignedSystemUrl,
          tenantInfo,
        };
      })
    );

    return NextResponse.json({
      success: true,
      results: enrichedResults,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

