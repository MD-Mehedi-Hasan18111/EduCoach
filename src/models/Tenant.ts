import mongoose, { Schema, Document, Model } from "mongoose";

export type TenantStatus = "ACTIVE" | "SUSPENDED" | "MAINTENANCE" | "PENDING_SETUP";
export type SubscriptionStatus = "ACTIVE" | "TRIAL" | "EXPIRED" | "CANCELLED";

export interface ITenantFeatures {
  smsAlerts: boolean;
  onlineAdmission: boolean;
  examPortal: boolean;
  accountsManagement: boolean;
  customDomain: boolean;
  prioritySupport?: boolean;
  customBranding?: boolean;
  reportsDownload?: boolean;
}

export interface ITenant extends Document {
  name: string;
  slug: string;
  logoUrl?: string;
  tagline?: string;
  establishedYear?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  websiteUrl?: string;
  batchTypes?: string[];
  description?: string;
  status: TenantStatus;
  systemUrl: string;
  databaseName?: string;
  mongoUri?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  portalPasswordHash?: string;
  planCode: "FREE" | "STARTER" | "STANDARD" | "PRO" | "ENTERPRISE";
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt: Date;
  licenseKey: string;
  features: ITenantFeatures;
  maintenanceReason?: string;
  suspensionReason?: string;
  lastPingAt?: Date;
  lastPingStatus?: "ONLINE" | "OFFLINE" | "UNKNOWN";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logoUrl: { type: String, default: "" },
    tagline: { type: String, default: "" },
    establishedYear: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    websiteUrl: { type: String, default: "" },
    batchTypes: { type: [String], default: [] },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "MAINTENANCE", "PENDING_SETUP"],
      default: "ACTIVE",
    },
    systemUrl: { type: String, required: true, trim: true },
    databaseName: { type: String, default: "" },
    mongoUri: { type: String, default: "" },
    ownerName: { type: String, required: true },
    ownerEmail: { type: String, required: true, lowercase: true, trim: true },
    ownerPhone: { type: String, required: true },
    portalPasswordHash: { type: String },
    planCode: {
      type: String,
      enum: ["FREE", "STARTER", "STANDARD", "PRO", "ENTERPRISE"],
      default: "FREE",
    },
    subscriptionStatus: {
      type: String,
      enum: ["ACTIVE", "TRIAL", "EXPIRED", "CANCELLED"],
      default: "TRIAL",
    },
    subscriptionExpiresAt: { type: Date, required: true },
    licenseKey: { type: String, required: true, unique: true },
    features: {
      smsAlerts: { type: Boolean, default: false },
      onlineAdmission: { type: Boolean, default: true },
      examPortal: { type: Boolean, default: true },
      accountsManagement: { type: Boolean, default: true },
      customDomain: { type: Boolean, default: false },
      reportsDownload: { type: Boolean, default: true },
    },
    maintenanceReason: { type: String, default: "" },
    suspensionReason: { type: String, default: "" },
    lastPingAt: { type: Date },
    lastPingStatus: {
      type: String,
      enum: ["ONLINE", "OFFLINE", "UNKNOWN"],
      default: "UNKNOWN",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Tenant: Model<ITenant> =
  mongoose.models.Tenant || mongoose.model<ITenant>("Tenant", TenantSchema);
