import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { Tenant } from "@/models/Tenant";
import { Plan } from "@/models/Plan";
import { Subscription } from "@/models/Subscription";
import { ActivityLog } from "@/models/ActivityLog";
import { requireSuperAdmin } from "@/lib/auth-helper";
import { generateLicenseKey } from "@/lib/utils";

// POST /api/systems/seed: 1-click initialize Al-Hikmah and Shikkhon into the cloud database
export async function POST(request: NextRequest) {
  try {
    const { errorResponse, session } = requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    await connectToDatabase();

    // 1. Ensure plans exist
    const planCount = await Plan.countDocuments();
    if (planCount === 0) {
      await Plan.insertMany([
        {
          name: "Free MVP Tier",
          code: "FREE",
          description: "Default free plan for every registering coaching institute. All core modules included.",
          priceMonthly: 0,
          priceYearly: 0,
          maxStudents: 200,
          maxBatches: 10,
          maxTeachers: 15,
          maxBranches: 1,
          features: {
            smsAlerts: false,
            onlineAdmission: true,
            examPortal: true,
            accountsManagement: true,
            customDomain: false,
            prioritySupport: false,
            customBranding: true,
            reportsDownload: true,
          },
          isPopular: true,
          isActive: true,
          isAvailableNow: true,
        },
        {
          name: "Standard Growth (Planned)",
          code: "STANDARD",
          description: "Planned future plan for growing coaching centers with multi-batch classes and automated SMS alerts.",
          priceMonthly: 2999,
          priceYearly: 29990,
          maxStudents: 600,
          maxBatches: 30,
          maxTeachers: 30,
          maxBranches: 2,
          features: {
            smsAlerts: true,
            onlineAdmission: true,
            examPortal: true,
            accountsManagement: true,
            customDomain: true,
            prioritySupport: false,
            customBranding: true,
            reportsDownload: true,
          },
          isPopular: false,
          isActive: true,
          isAvailableNow: false,
        },
        {
          name: "Institutional Pro (Planned)",
          code: "PRO",
          description: "Planned premier tier for multi-campus networks with dedicated database backups and custom integrations.",
          priceMonthly: 5999,
          priceYearly: 59990,
          maxStudents: 2000,
          maxBatches: 80,
          maxTeachers: 60,
          maxBranches: 5,
          features: {
            smsAlerts: true,
            onlineAdmission: true,
            examPortal: true,
            accountsManagement: true,
            customDomain: true,
            prioritySupport: true,
            customBranding: true,
            reportsDownload: true,
          },
          isPopular: false,
          isActive: true,
          isAvailableNow: false,
        },
      ]);
    }

    const now = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(now.getFullYear() + 1);

    const portalPasswordHash = await bcrypt.hash("coaching123", 10);
    const results = [];

    // 2. Check / insert Al-Hikmah
    let alHikma = await Tenant.findOne({ slug: "al-hikma" });
    if (!alHikma) {
      alHikma = await Tenant.create({
        name: "আল-হিকমাহ্ (Al-Hikmah)",
        slug: "al-hikma",
        status: "ACTIVE",
        systemUrl: "https://al-hikmah-five.vercel.app",
        databaseName: "al-hikma",
        mongoUri:
          "mongodb+srv://al-hikma:b06heZLStFvtFtql@cluster0.muxc7lg.mongodb.net/al-hikma?retryWrites=true&w=majority&appName=Cluster0",
        ownerName: "Principal Mohammad Hasan",
        ownerEmail: "hasan@alhikma.edu",
        ownerPhone: "+8801712345678",
        portalPasswordHash,
        planCode: "FREE",
        subscriptionStatus: "ACTIVE",
        subscriptionExpiresAt: nextYear,
        licenseKey: generateLicenseKey("alhikma"),
        features: {
          smsAlerts: false,
          onlineAdmission: true,
          examPortal: true,
          accountsManagement: true,
          customDomain: true,
          reportsDownload: true,
        },
        lastPingAt: now,
        lastPingStatus: "ONLINE",
        notes: "Live deployed instance on Vercel (https://al-hikmah-five.vercel.app)",
      });

      await Subscription.create({
        tenantId: alHikma._id,
        coachingName: alHikma.name,
        planCode: "FREE",
        billingCycle: "YEARLY",
        startDate: now,
        endDate: nextYear,
        amount: 0,
        status: "ACTIVE",
        autoRenew: true,
        notes: "Free MVP Tier (200 Students, 10 Batches)",
      });

      results.push("Al-Hikmah initialized");
    }

    // 3. Check / insert Shikkhon
    let shikkhon = await Tenant.findOne({ slug: "shikkhon" });
    if (!shikkhon) {
      shikkhon = await Tenant.create({
        name: "শিক্ষণ (Shikkhon)",
        slug: "shikkhon",
        status: "ACTIVE",
        systemUrl: "https://shikkhon.vercel.app",
        databaseName: "shikkhon",
        mongoUri:
          "mongodb+srv://shikkhon:e7HujuAczUXiTdOp@cluster0.yai2s.mongodb.net/shikkhon?retryWrites=true&w=majority&appName=Cluster0",
        ownerName: "Engr. Tanvir Ahmed",
        ownerEmail: "tanvir@shikkhon.edu",
        ownerPhone: "+8801812345679",
        portalPasswordHash,
        planCode: "FREE",
        subscriptionStatus: "ACTIVE",
        subscriptionExpiresAt: nextYear,
        licenseKey: generateLicenseKey("shikkhon"),
        features: {
          smsAlerts: false,
          onlineAdmission: true,
          examPortal: true,
          accountsManagement: true,
          customDomain: true,
          reportsDownload: true,
        },
        lastPingAt: now,
        lastPingStatus: "ONLINE",
        notes: "Live deployed instance on Vercel (https://shikkhon.vercel.app)",
      });

      await Subscription.create({
        tenantId: shikkhon._id,
        coachingName: shikkhon.name,
        planCode: "FREE",
        billingCycle: "YEARLY",
        startDate: now,
        endDate: nextYear,
        amount: 0,
        status: "ACTIVE",
        autoRenew: true,
        notes: "Free MVP Tier (200 Students, 10 Batches)",
      });

      results.push("Shikkhon initialized");
    }

    await ActivityLog.create({
      action: "DEMO_SYSTEMS_SEEDED",
      category: "SYSTEM_ACCESS",
      performedBy: session?.name || "SUPER_ADMIN",
      details: "Seeded Al-Hikmah and Shikkhon live systems into EduCoach master registry.",
    });

    return NextResponse.json({
      success: true,
      message: "Live demo systems initialized successfully in the database!",
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
