import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Tenant } from "@/models/Tenant";
import { Plan } from "@/models/Plan";
import { autoSeedMasterDatabase } from "@/lib/auto-seed";

// Child systems (Al Hikma, Shikkhon, and future coaching systems) call this
// to verify license status, remote accessibility, and plan quotas (students, batches, teachers).
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-license-key",
    },
  });
}

export async function GET(request: NextRequest) {
  return handleVerification(request);
}

export async function POST(request: NextRequest) {
  return handleVerification(request);
}

async function handleVerification(request: NextRequest) {
  try {
    const url = new URL(request.url);
    let slug = url.searchParams.get("slug");
    let licenseKey =
      request.headers.get("x-license-key") || url.searchParams.get("licenseKey");

    if (request.method === "POST") {
      try {
        const body = await request.json();
        if (body.slug) slug = body.slug;
        if (body.licenseKey) licenseKey = body.licenseKey;
      } catch {
        // Body parsing optional
      }
    }

    if (!slug && !licenseKey) {
      return NextResponse.json(
        {
          allowed: false,
          status: "SUSPENDED",
          error: "Either 'slug' query/body param or 'x-license-key' header is required.",
        },
        {
          status: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    await connectToDatabase();
    await autoSeedMasterDatabase();

    const query: any = {};
    if (slug) query.slug = slug.toLowerCase().trim();
    if (licenseKey) query.licenseKey = licenseKey.trim();

    const tenant = await Tenant.findOne(query);

    if (!tenant) {
      return NextResponse.json(
        {
          allowed: false,
          status: "SUSPENDED",
          error: "No coaching system registered with the provided credentials.",
        },
        {
          status: 404,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // Fetch corresponding plan quotas
    const plan = await Plan.findOne({ code: tenant.planCode });
    const quotas = {
      maxStudents: plan?.maxStudents ?? (tenant.planCode === "FREE" ? 200 : 99999),
      maxBatches: plan?.maxBatches ?? (tenant.planCode === "FREE" ? 10 : 9999),
      maxTeachers: plan?.maxTeachers ?? (tenant.planCode === "FREE" ? 15 : 9999),
    };

    const now = new Date();
    const isExpired =
      tenant.subscriptionExpiresAt && new Date(tenant.subscriptionExpiresAt) < now;

    // Determine final accessibility
    let allowed = false;
    let effectiveStatus = tenant.status;
    let message = "System operational.";

    if (tenant.status === "MAINTENANCE") {
      allowed = false;
      message =
        tenant.maintenanceReason ||
        "এডুকোচ মাস্টার কনসোল থেকে রক্ষণাবেক্ষণ (Maintenance) চলছে। সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত।";
    } else if (tenant.status === "SUSPENDED") {
      allowed = false;
      message =
        tenant.suspensionReason ||
        "এই কোচিং সিস্টেমটির পরিষেবা সাময়িকভাবে স্থগিত রয়েছে। বিস্তারিত জানতে এডুকোচ মাস্টার প্রশাসনের সাথে যোগাযোগ করুন।";
    } else if (tenant.status === "PENDING_SETUP") {
      allowed = false;
      message = "কোচিং সিস্টেমের প্রাথমিক সেটআপ প্রক্রিয়াধীন। অনুগ্রহ করে অ্যাক্টিভেশনের জন্য অপেক্ষা করুন।";
    } else if (isExpired) {
      allowed = false;
      effectiveStatus = "SUSPENDED";
      message = "আপনার কোচিং সাবস্ক্রিপশনের মেয়াদ শেষ হয়েছে। দয়া করে এডুকোচ পোর্টালে গিয়ে নবায়ন করুন।";
    } else {
      allowed = true;
    }

    const reason =
      tenant.status === "MAINTENANCE"
        ? tenant.maintenanceReason || message
        : tenant.status === "SUSPENDED"
        ? tenant.suspensionReason || message
        : "";

    return NextResponse.json(
      {
        allowed,
        systemName: tenant.name,
        slug: tenant.slug,
        status: effectiveStatus,
        message,
        reason,
        planCode: tenant.planCode,
        subscriptionStatus: tenant.subscriptionStatus,
        subscriptionExpiresAt: tenant.subscriptionExpiresAt,
        quotas,
        features: tenant.features,
        verifiedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { allowed: false, status: "ERROR", error: error.message },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
