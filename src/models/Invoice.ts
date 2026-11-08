import mongoose, { Schema, Document, Model } from "mongoose";

export type InvoiceStatus = "PAID" | "PENDING" | "OVERDUE" | "CANCELLED";
export type PaymentMethod = "BKASH" | "NAGAD" | "ROCKET" | "BANK_TRANSFER" | "MANUAL" | "CARD";

export interface IInvoice extends Document {
  invoiceNumber: string;
  tenantId: mongoose.Types.ObjectId;
  coachingName: string;
  ownerEmail: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  billingPeriod: string;
  dueDate: Date;
  paidAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    coachingName: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "BDT" },
    status: {
      type: String,
      enum: ["PAID", "PENDING", "OVERDUE", "CANCELLED"],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      enum: ["BKASH", "NAGAD", "ROCKET", "BANK_TRANSFER", "MANUAL", "CARD"],
    },
    transactionId: { type: String, default: "" },
    billingPeriod: { type: String, required: true },
    dueDate: { type: Date, required: true },
    paidAt: { type: Date },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);

