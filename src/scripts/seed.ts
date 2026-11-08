import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin";
import { Plan } from "../models/Plan";
import { Tenant } from "../models/Tenant";
import { RegistrationRequest } from "../models/RegistrationRequest";
import { Subscription } from "../models/Subscription";
import { Invoice } from "../models/Invoice";
import { ActivityLog } from "../models/ActivityLog";
import { generateLicenseKey } from "../lib/utils";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/educoach_master";

async function seed() {
  console.log(" Connecting to EduCoach Master Database:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  console.log("🌱 Clearing existing seed data...");
  await Promise.all([
    Admin.deleteMany({}),
    Plan.deleteMany({}),
    Tenant.deleteMany({}),
    RegistrationRequest.deleteMany({}),
    Subscription.deleteMany({}),
    Invoice.deleteMany({}),
    ActivityLog.deleteMany({}),
  ]);

  // 1. Seed Super Admin
  const adminPassword = process.env.ADMIN_PASSWORD || "EduCoach@2026";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const superAdmin = await Admin.create({
    name: process.env.ADMIN_NAME || "EduCoach Master Admin",
    email: (process.env.ADMIN_EMAIL || "admin@educoach.com").toLowerCase(),
    passwordHash,
    role: "SUPER_ADMIN",
    isActive: true,
  });
  console.log(` Super Admin created: ${superAdmin.email}`);

  // 2. Seed Plans: Free MVP tier for everyone + 2 planned future tiers
  const plans = await Plan.insertMany([
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
  console.log(` Created ${plans.length} subscription plans.`);

  // 3. Seed Live Deployed Tenants (Al Hikmah & Shikkhon on Vercel)
  const portalPassword = await bcrypt.hash("coaching123", 10);
  const now = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(now.getFullYear() + 1);

  const alHikmaTenant = await Tenant.create({
    name: "আল-হিকমাহ্ কোচিং সেন্টার (Al-Hikmah)",
    slug: "al-hikma",
    status: "ACTIVE",
    systemUrl: "https://al-hikmah-five.vercel.app",
    databaseName: "al-hikma",
    mongoUri:
      "mongodb+srv://al-hikma:b06heZLStFvtFtql@cluster0.muxc7lg.mongodb.net/al-hikma?retryWrites=true&w=majority&appName=Cluster0",
    ownerName: "Principal Mohammad Hasan",
    ownerEmail: "hasan@alhikma.edu",
    ownerPhone: "+8801712345678",
    portalPasswordHash: portalPassword,
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
    lastPingAt: new Date(),
    lastPingStatus: "ONLINE",
    notes: "Live deployed instance on Vercel (https://al-hikmah-five.vercel.app)",
  });

  const shikkhonTenant = await Tenant.create({
    name: "শিক্ষণ কোচিং প্ল্যাটফর্ম (Shikkhon)",
    slug: "shikkhon",
    status: "ACTIVE",
    systemUrl: "https://shikkhon.vercel.app",
    databaseName: "shikkhon",
    mongoUri:
      "mongodb+srv://shikkhon:e7HujuAczUXiTdOp@cluster0.yai2s.mongodb.net/shikkhon?retryWrites=true&w=majority&appName=Cluster0",
    ownerName: "Engr. Tanvir Ahmed",
    ownerEmail: "tanvir@shikkhon.edu",
    ownerPhone: "+8801812345679",
    portalPasswordHash: portalPassword,
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
    lastPingAt: new Date(),
    lastPingStatus: "ONLINE",
    notes: "Live deployed instance on Vercel (https://shikkhon.vercel.app)",
  });

  console.log(` Seeded 2 Active Tenants: ${alHikmaTenant.name} & ${shikkhonTenant.name}`);

  // 4. Seed Subscriptions
  await Subscription.insertMany([
    {
      tenantId: alHikmaTenant._id,
      coachingName: alHikmaTenant.name,
      planCode: "FREE",
      billingCycle: "YEARLY",
      startDate: now,
      endDate: nextYear,
      amount: 0,
      status: "ACTIVE",
      autoRenew: true,
      notes: "Free MVP Tier (200 Students, 10 Batches)",
    },
    {
      tenantId: shikkhonTenant._id,
      coachingName: shikkhonTenant.name,
      planCode: "FREE",
      billingCycle: "YEARLY",
      startDate: now,
      endDate: nextYear,
      amount: 0,
      status: "ACTIVE",
      autoRenew: true,
      notes: "Free MVP Tier (200 Students, 10 Batches)",
    },
  ]);

  // 5. Seed Activity Logs
  await ActivityLog.create({
    action: "SYSTEM_INITIALIZED",
    category: "SECURITY",
    performedBy: "SUPER_ADMIN",
    details: "EduCoach Master Platform database initialized with Vercel live deployments.",
  });

  console.log(" Seed completed successfully!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(" Seed failed:", err);
  process.exit(1);
});
