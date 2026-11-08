import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubscription extends Document {
  tenantId: mongoose.Types.ObjectId;
  coachingName: string;
  planCode: "FREE" | "STARTER" | "STANDARD" | "PRO" | "ENTERPRISE";
  billingCycle: "MONTHLY" | "YEARLY";
  startDate: Date;
  endDate: Date;
  amount: number;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "TRIAL";
  autoRenew: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    coachingName: { type: String, required: true },
    planCode: {
      type: String,
      enum: ["FREE", "STARTER", "STANDARD", "PRO", "ENTERPRISE"],
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ["MONTHLY", "YEARLY"],
      default: "MONTHLY",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "CANCELLED", "TRIAL"],
      default: "ACTIVE",
    },
    autoRenew: { type: Boolean, default: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

