import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth-helper";
import { connectToDatabase } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { Tenant } from "@/models/Tenant";

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    await connectToDatabase();

    if (session.role === "SUPER_ADMIN") {
      const admin = await Admin.findById(session.userId).select("-passwordHash");
      return NextResponse.json({
        authenticated: true,
        user: {
          id: admin?._id || session.userId,
          name: admin?.name || session.name,
          email: admin?.email || session.email,
          role: "SUPER_ADMIN",
        },
      });
    }

    if (session.role === "COACHING_ADMIN" || session.role === "TENANT_OWNER") {
      let tenant = null;
      if (session.tenantId) {
        tenant = await Tenant.findById(session.tenantId).select("-portalPasswordHash");
      } else if (session.systemSlug) {
        tenant = await Tenant.findOne({ slug: session.systemSlug }).select("-portalPasswordHash");
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: session.userId,
          name: session.name,
          email: session.email,
          role: "COACHING_ADMIN",
          tenantId: tenant?._id || session.tenantId,
          systemSlug: tenant?.slug || session.systemSlug,
          coachingName: tenant?.name || session.coachingName,
          systemUrl: tenant?.systemUrl || session.systemUrl,
          tenantDetails: tenant,
        },
      });
    }

    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}
