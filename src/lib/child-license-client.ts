/**
 * EduCoach Master Licensing, Accessibility & Quota Client
 * Shared helper for coaching management systems (Al Hikma, Shikkhon, and any new system)
 * to verify license status, remote accessibility, and enforce subscription limits.
 */

export interface LicenseStatusResponse {
  allowed: boolean;
  systemName: string;
  slug: string;
  status: "ACTIVE" | "MAINTENANCE" | "SUSPENDED" | "PENDING_SETUP" | "ERROR";
  message: string;
  planCode: string;
  subscriptionStatus: string;
  subscriptionExpiresAt: string;
  quotas: {
    maxStudents: number;
    maxBatches: number;
    maxTeachers: number;
  };
  features: {
    smsAlerts: boolean;
    onlineAdmission: boolean;
    examPortal: boolean;
    accountsManagement: boolean;
    customDomain: boolean;
    reportsDownload?: boolean;
    customBranding?: boolean;
    prioritySupport?: boolean;
  };
}

const EDUCOACH_MASTER_URL =
  process.env.EDUCOACH_MASTER_URL || "http://localhost:3050";
const SYSTEM_SLUG = process.env.EDUCOACH_SYSTEM_SLUG || process.env.NEXT_PUBLIC_SYSTEM_SLUG || "al-hikma";
const LICENSE_KEY = process.env.EDUCOACH_LICENSE_KEY || "";

let cachedLicense: { data: LicenseStatusResponse; expiresAt: number } | null = null;

export async function verifyMasterAccessibility(slugOverride?: string): Promise<LicenseStatusResponse> {
  const slug = slugOverride || SYSTEM_SLUG;
  const now = Date.now();

  // Cache for 60 seconds to avoid hitting master on every single request
  if (cachedLicense && cachedLicense.data.slug === slug && cachedLicense.expiresAt > now) {
    return cachedLicense.data;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const headers: Record<string, string> = {};
    if (LICENSE_KEY) headers["x-license-key"] = LICENSE_KEY;

    const res = await fetch(
      `${EDUCOACH_MASTER_URL}/api/v1/license/verify?slug=${slug}`,
      {
        headers,
        signal: controller.signal,
        cache: "no-store",
      }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data: LicenseStatusResponse = await res.json();
      cachedLicense = { data, expiresAt: now + 60 * 1000 };
      return data;
    }

    const errData = await res.json().catch(() => ({}));
    return {
      allowed: false,
      status: errData.status || "SUSPENDED",
      message: errData.error || errData.message || "System access verification failed.",
      systemName: slug,
      slug,
      planCode: "FREE",
      subscriptionStatus: "UNKNOWN",
      subscriptionExpiresAt: "",
      quotas: {
        maxStudents: 200,
        maxBatches: 10,
        maxTeachers: 15,
      },
      features: {
        smsAlerts: false,
        onlineAdmission: true,
        examPortal: true,
        accountsManagement: true,
        customDomain: false,
      },
    };
  } catch (err: any) {
    // Graceful offline fallback during development/network glitches: allow access with Free MVP quotas
    return {
      allowed: true,
      status: "ACTIVE",
      message: "EduCoach Master offline — fallback access active.",
      systemName: slug,
      slug,
      planCode: "FREE",
      subscriptionStatus: "ACTIVE",
      subscriptionExpiresAt: "",
      quotas: {
        maxStudents: 200,
        maxBatches: 10,
        maxTeachers: 15,
      },
      features: {
        smsAlerts: false,
        onlineAdmission: true,
        examPortal: true,
        accountsManagement: true,
        customDomain: true,
        reportsDownload: true,
      },
    };
  }
}
