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

    isSeeded = true;
  } catch (err: any) {
    console.error("❌ [EduCoach AutoSeed Error]:", err.message);
  } finally {
    isSeeding = false;
  }
}
