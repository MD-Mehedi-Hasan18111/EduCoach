import bcrypt from "bcryptjs";
import { Admin } from "@/models/Admin";
import { Plan } from "@/models/Plan";
import { Tenant } from "@/models/Tenant";
import { Subscription } from "@/models/Subscription";
import { generateLicenseKey } from "@/lib/utils";

let isSeeding = false;
let isSeeded = false;

export async function autoSeedMasterDatabase() {
  if (isSeeded || isSeeding) return;
  isSeeding = true;

  try {
    // 1. Ensure Super Admin Account exists
    const superAdminEmail = (process.env.ADMIN_EMAIL || "admin@educoach.com").toLowerCase().trim();
    const existingSuperAdmin = await Admin.findOne({ email: superAdminEmail });
    if (!existingSuperAdmin) {
      const superAdminPassHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "EduCoach@2026", 10);
      await Admin.create({
        name: process.env.ADMIN_NAME || "EduCoach Master Admin",
        email: superAdminEmail,
        passwordHash: superAdminPassHash,
        role: "SUPER_ADMIN",
        isActive: true,
      });
      console.log("✅ [EduCoach AutoSeed] Super Admin initialized:", superAdminEmail);
    }

    // 2. Ensure Plans exist (Free MVP, Standard Planned, Pro Planned)
    const planCount = await Plan.countDocuments();
    if (planCount === 0) {
      await Plan.insertMany([
        {
          name: "Free MVP Tier",
          code: "FREE",
          description: "Default free plan for every registered coaching institute. Includes 200 students, 10 batches, and 15 teachers.",
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
          description: "Planned tier for expanding centers with automated SMS notifications and multi-batch management.",
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
          description: "Planned enterprise tier for multi-campus coaching centers with dedicated backups and priority support.",
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
      console.log("✅ [EduCoach AutoSeed] Subscription plans initialized");
    }

    // Common shared password hash for initial demo coaching owners
    const coachingPassHash = await bcrypt.hash("coaching123", 10);
    const now = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(now.getFullYear() + 2);

    // 3. Ensure Al-Hikmah Partner Tenant & Coaching Admin
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
        ownerName: "Al Hikmah Admin",
        ownerEmail: "admin@alhikma.com",
        ownerPhone: "+8801700000001",
        portalPasswordHash: coachingPassHash,
        planCode: "FREE",
        subscriptionStatus: "ACTIVE",
        subscriptionExpiresAt: nextYear,
        licenseKey: "EDULIC-ALHIKMA-FREE-2026",
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
        notes: "Initial Showcase Partner — Deployed on Vercel (https://al-hikmah-five.vercel.app)",
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
        notes: "Free MVP Tier (Max 200 Students, 10 Batches, 15 Teachers)",
      });
      console.log("✅ [EduCoach AutoSeed] Al-Hikmah partner system initialized");
    }

    // Ensure Al-Hikmah Coaching Admin in Admin collection
    const existingAlHikmaAdmin = await Admin.findOne({ email: "admin@alhikma.com" });
    if (!existingAlHikmaAdmin) {
      await Admin.create({
        name: "Al Hikmah Admin",
        email: "admin@alhikma.com",
        passwordHash: coachingPassHash,
        role: "COACHING_ADMIN",
        coachingSlug: "al-hikma",
        coachingName: "আল-হিকমাহ্ (Al-Hikmah)",
        systemUrl: "https://al-hikmah-five.vercel.app",
        phone: "+8801700000001",
        isActive: true,
      });
    }

    const existingHasanAdmin = await Admin.findOne({ email: "hasan@alhikma.edu" });
    if (!existingHasanAdmin) {
      await Admin.create({
        name: "Principal Mohammad Hasan",
        email: "hasan@alhikma.edu",
        passwordHash: coachingPassHash,
        role: "COACHING_ADMIN",
        coachingSlug: "al-hikma",
        coachingName: "আল-হিকমাহ্ (Al-Hikmah)",
        systemUrl: "https://al-hikmah-five.vercel.app",
        phone: "+8801712345678",
        isActive: true,
      });
    }

    // 4. Ensure Shikkhon Partner Tenant & Coaching Admin
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
        ownerName: "Shikkhon Admin",
        ownerEmail: "admin@shikkhon.com",
        ownerPhone: "+8801700000002",
        portalPasswordHash: coachingPassHash,
        planCode: "FREE",
        subscriptionStatus: "ACTIVE",
        subscriptionExpiresAt: nextYear,
        licenseKey: "EDULIC-SHIKKHON-FREE-2026",
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
        notes: "Initial Showcase Partner — Deployed on Vercel (https://shikkhon.vercel.app)",
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
        notes: "Free MVP Tier (Max 200 Students, 10 Batches, 15 Teachers)",
      });
      console.log("✅ [EduCoach AutoSeed] Shikkhon partner system initialized");
    }

    // Ensure Shikkhon Coaching Admin in Admin collection
    const existingShikkhonAdmin = await Admin.findOne({ email: "admin@shikkhon.com" });
    if (!existingShikkhonAdmin) {
      await Admin.create({
        name: "Shikkhon Admin",
        email: "admin@shikkhon.com",
        passwordHash: coachingPassHash,
        role: "COACHING_ADMIN",
        coachingSlug: "shikkhon",
        coachingName: "শিক্ষণ (Shikkhon)",
        systemUrl: "https://shikkhon.vercel.app",
        phone: "+8801700000002",
        isActive: true,
      });
    }

    isSeeded = true;
  } catch (err: any) {
    console.error("❌ [EduCoach AutoSeed Error]:", err.message);
  } finally {
    isSeeding = false;
  }
}
