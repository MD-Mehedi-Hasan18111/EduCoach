import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { Tenant } from "@/models/Tenant";
import { signToken } from "@/lib/jwt";
import { autoSeedMasterDatabase } from "@/lib/auto-seed";

async function verifyPassword(inputPassword: string, storedHash: string): Promise<boolean> {
  if (!storedHash) return false;
  // If stored as bcrypt hash
  if (storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$") || storedHash.startsWith("$2y$")) {
    return bcrypt.compare(inputPassword, storedHash);
  }
  // Fallback for manually entered plaintext in MongoDB Compass
  return inputPassword === storedHash;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    await autoSeedMasterDatabase();
    const cleanEmail = email.toLowerCase().trim();

    const envAdminEmail = (process.env.ADMIN_EMAIL || "admin@educoach.com").toLowerCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD || "EduCoach@2026";

    // Direct Super Admin environment match check
    if (cleanEmail === envAdminEmail && password === envAdminPassword) {
      let superAdmin = await Admin.findOne({ email: envAdminEmail });
      if (!superAdmin) {
        const passwordHash = await bcrypt.hash(envAdminPassword, 10);
        superAdmin = await Admin.create({
          name: process.env.ADMIN_NAME || "EduCoach Master Admin",
          email: envAdminEmail,
          passwordHash,
          role: "SUPER_ADMIN",
          isActive: true,
          lastLogin: new Date(),
        });
      } else {
        superAdmin.lastLogin = new Date();
        await superAdmin.save();
      }

      const token = signToken({
        userId: superAdmin._id.toString(),
        email: superAdmin.email,
        role: "SUPER_ADMIN",
        name: superAdmin.name,
      });

      const response = NextResponse.json({
        success: true,
        role: "SUPER_ADMIN",
        user: {
          id: superAdmin._id,
          name: superAdmin.name,
          email: superAdmin.email,
          role: "SUPER_ADMIN",
        },
        token,
      });

      response.cookies.set("educoach_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // 2. Check in admins collection (Supports both Master Super Admin and Coaching Admins)
    const admin = await Admin.findOne({ email: cleanEmail, isActive: true });
    if (admin) {
      const isMatch = await verifyPassword(password, admin.passwordHash);
      if (isMatch) {
        // If stored in plaintext, auto-hash it
        if (!admin.passwordHash.startsWith("$2a$") && !admin.passwordHash.startsWith("$2b$")) {
          admin.passwordHash = await bcrypt.hash(password, 10);
        }
        admin.lastLogin = new Date();
        await admin.save();

        const token = signToken({
          userId: admin._id.toString(),
          email: admin.email,
          role: admin.role,
          name: admin.name,
          systemSlug: admin.coachingSlug,
          coachingName: admin.coachingName,
          systemUrl: admin.systemUrl,
        });

        const response = NextResponse.json({
          success: true,
          role: admin.role,
          user: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            coachingSlug: admin.coachingSlug,
            coachingName: admin.coachingName,
            systemUrl: admin.systemUrl,
          },
          token,
        });

        response.cookies.set("educoach_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });

        return response;
      }
    }

    // 3. Check in tenants collection (Coaching Center Owner / Super Admin)
    const tenant = await Tenant.findOne({ ownerEmail: cleanEmail });
    if (tenant && tenant.portalPasswordHash) {
      const isMatch = await verifyPassword(password, tenant.portalPasswordHash);
      if (isMatch) {
        if (!tenant.portalPasswordHash.startsWith("$2a$") && !tenant.portalPasswordHash.startsWith("$2b$")) {
          tenant.portalPasswordHash = await bcrypt.hash(password, 10);
          await tenant.save();
        }

        const token = signToken({
          userId: tenant._id.toString(),
          email: tenant.ownerEmail,
          role: "COACHING_ADMIN",
          name: tenant.ownerName,
          tenantId: tenant._id.toString(),
          systemSlug: tenant.slug,
          coachingName: tenant.name,
          systemUrl: tenant.systemUrl,
        });

        const response = NextResponse.json({
          success: true,
          role: "COACHING_ADMIN",
          user: {
            id: tenant._id,
            name: tenant.ownerName,
            email: tenant.ownerEmail,
            role: "COACHING_ADMIN",
            tenantId: tenant._id,
            systemSlug: tenant.slug,
            coachingName: tenant.name,
            systemUrl: tenant.systemUrl,
          },
          token,
        });

        response.cookies.set("educoach_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });

        return response;
      }
    }

    return NextResponse.json(
      { success: false, error: "Invalid email or password." },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process login." },
      { status: 500 }
    );
  }
}
