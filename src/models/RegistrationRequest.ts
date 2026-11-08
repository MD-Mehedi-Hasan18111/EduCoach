import mongoose, { Schema, Document, Model } from "mongoose";

export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IRegistrationRequest extends Document {
  referenceCode: string;
  coachingName: string;
  requestedSlug: string;
  directorName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  estimatedStudents: number;
  planCode: "FREE" | "STARTER" | "STANDARD" | "PRO" | "ENTERPRISE";
  billingCycle: "MONTHLY" | "YEARLY";
  customRequirements?: string;
  status: RequestStatus;
  notes?: string;
  assignedTenantId?: mongoose.Types.ObjectId;
  assignedSystemUrl?: string;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationRequestSchema = new Schema<IRegistrationRequest>(
  {
    referenceCode: { type: String, required: true, unique: true },
    coachingName: { type: String, required: true, trim: true },
    requestedSlug: { type: String, required: true, lowercase: true, trim: true },
    directorName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    estimatedStudents: { type: Number, default: 50 },
    planCode: {
      type: String,
      enum: ["FREE", "STARTER", "STANDARD", "PRO", "ENTERPRISE"],
      default: "FREE",
    },
    billingCycle: {
      type: String,
      enum: ["MONTHLY", "YEARLY"],
      default: "MONTHLY",
    },
    customRequirements: { type: String, default: "" },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    notes: { type: String, default: "" },
    assignedTenantId: { type: Schema.Types.ObjectId, ref: "Tenant" },
    assignedSystemUrl: { type: String, default: "" },
    reviewedAt: { type: Date },
    reviewedBy: { type: String },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

export const RegistrationRequest: Model<IRegistrationRequest> =
  mongoose.models.RegistrationRequest ||
  mongoose.model<IRegistrationRequest>("RegistrationRequest", RegistrationRequestSchema);

