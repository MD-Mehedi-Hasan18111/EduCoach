import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlanFeatures {
  smsAlerts: boolean;
  onlineAdmission: boolean;
  examPortal: boolean;
  accountsManagement: boolean;
  customDomain: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
  reportsDownload?: boolean;
}

export interface IPlan extends Document {
  name: string;
  code: "FREE" | "STARTER" | "STANDARD" | "PRO" | "ENTERPRISE";
  description: string;
  priceMonthly: number;
  priceYearly: number;
  maxStudents: number;
  maxBatches: number;
  maxTeachers: number;
  maxBranches: number;
  features: IPlanFeatures;
  isPopular?: boolean;
  isActive: boolean;
  isAvailableNow?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>(
  {
    name: { type: String, required: true },
    code: {
      type: String,
      required: true,
      unique: true,
      enum: ["FREE", "STARTER", "STANDARD", "PRO", "ENTERPRISE"],
    },
    description: { type: String, default: "" },
    priceMonthly: { type: Number, default: 0 },
    priceYearly: { type: Number, default: 0 },
    maxStudents: { type: Number, default: 200 },
    maxBatches: { type: Number, default: 10 },
    maxTeachers: { type: Number, default: 15 },
    maxBranches: { type: Number, default: 1 },
    features: {
      smsAlerts: { type: Boolean, default: false },
      onlineAdmission: { type: Boolean, default: true },
      examPortal: { type: Boolean, default: true },
      accountsManagement: { type: Boolean, default: true },
      customDomain: { type: Boolean, default: false },
      prioritySupport: { type: Boolean, default: false },
      customBranding: { type: Boolean, default: false },
      reportsDownload: { type: Boolean, default: true },
    },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isAvailableNow: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Plan: Model<IPlan> =
  mongoose.models.Plan || mongoose.model<IPlan>("Plan", PlanSchema);
