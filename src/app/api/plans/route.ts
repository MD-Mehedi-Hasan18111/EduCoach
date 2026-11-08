import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Plan } from "@/models/Plan";

// GET /api/plans: Publicly accessible list of available subscription plans
export async function GET() {
  try {
    await connectToDatabase();
    let plans = await Plan.find({ isActive: true }).sort({ priceMonthly: 1 });

    // Fallback default plans
    if (!plans || plans.length === 0) {
      plans = [
        {
          code: "FREE",
          name: "Free MVP Tier",
          description: "Full-featured MVP for every registering coaching center. Register and get started immediately.",
          priceMonthly: 0,
          priceYearly: 0,
          maxStudents: 200,
          maxBatches: 10,
          maxTeachers: 10,
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
          isAvailableNow: true,
        },
        {
          code: "STANDARD",
          name: "Growth Tier",
          description: "For expanding institutes needing larger student limits and automated SMS gateway integration.",
          priceMonthly: 2999,
          priceYearly: 29990,
          maxStudents: 600,
          maxBatches: 30,
          maxTeachers: 25,
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
          isAvailableNow: false, // Planned for future
        },
        {
          code: "PRO",
          name: "Institutional Pro",
          description: "Full suite for premier academic institutions needing large-scale testing and priority infrastructure.",
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
          isAvailableNow: false, // Planned for future
        },
      ] as any;
    }

    return NextResponse.json({ success: true, plans });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
