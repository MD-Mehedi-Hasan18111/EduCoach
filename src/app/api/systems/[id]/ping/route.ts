import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Tenant } from "@/models/Tenant";
import { requireSuperAdmin } from "@/lib/auth-helper";

// POST /api/systems/[id]/ping: Check if child coaching system URL is reachable
export async function POST(
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

    let isOnline = false;
    let responseTimeMs = 0;
    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(tenant.systemUrl, {
        method: "HEAD",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      responseTimeMs = Date.now() - startTime;
      isOnline = res.status < 500;
    } catch (err) {
      isOnline = false;
    }

    tenant.lastPingAt = new Date();
    tenant.lastPingStatus = isOnline ? "ONLINE" : "OFFLINE";
    await tenant.save();

    return NextResponse.json({
      success: true,
      status: tenant.lastPingStatus,
      lastPingAt: tenant.lastPingAt,
      responseTimeMs: isOnline ? responseTimeMs : null,
      message: isOnline
        ? `Coaching system '${tenant.name}' is healthy and reachable (${responseTimeMs}ms).`
        : `Coaching system '${tenant.name}' is unreachable at ${tenant.systemUrl}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

