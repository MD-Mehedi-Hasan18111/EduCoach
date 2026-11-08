import mongoose, { Schema, Document, Model } from "mongoose";

export interface IActivityLog extends Document {
  action: string;
  category: "SYSTEM_ACCESS" | "SUBSCRIPTION" | "ONBOARDING" | "SECURITY";
  performedBy: string;
  tenantSlug?: string;
  tenantName?: string;
  details: string;
  ipAddress?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    action: { type: String, required: true },
    category: {
      type: String,
      enum: ["SYSTEM_ACCESS", "SUBSCRIPTION", "ONBOARDING", "SECURITY"],
      default: "SYSTEM_ACCESS",
    },
    performedBy: { type: String, required: true, default: "SUPER_ADMIN" },
    tenantSlug: { type: String },
    tenantName: { type: String },
    details: { type: String, required: true },
    ipAddress: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);

