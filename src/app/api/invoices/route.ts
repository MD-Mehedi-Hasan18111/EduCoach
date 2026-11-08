import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Invoice } from "@/models/Invoice";
import { getSessionFromRequest, requireSuperAdmin } from "@/lib/auth-helper";

// GET /api/invoices
export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const query: any = {};
    if (session.role === "TENANT_OWNER") {
      query.tenantId = session.tenantId;
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      invoices,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/invoices: Update invoice status (e.g., mark paid or record transaction)
export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { invoiceId, status, paymentMethod, transactionId } = body;

    await connectToDatabase();

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return NextResponse.json({ success: false, error: "Invoice not found." }, { status: 404 });
    }

    // Tenant owners can submit transactionId for pending invoice
    if (session.role === "TENANT_OWNER") {
      if (invoice.tenantId.toString() !== session.tenantId) {
        return NextResponse.json({ success: false, error: "Access denied." }, { status: 403 });
      }
      if (transactionId) invoice.transactionId = transactionId;
      if (paymentMethod) invoice.paymentMethod = paymentMethod;
      await invoice.save();
      return NextResponse.json({
        success: true,
        message: "Payment transaction details submitted for verification.",
        invoice,
      });
    }

    // Super Admin can mark as PAID or change status
    if (session.role === "SUPER_ADMIN") {
      if (status) invoice.status = status;
      if (paymentMethod) invoice.paymentMethod = paymentMethod;
      if (transactionId) invoice.transactionId = transactionId;
      if (status === "PAID" && !invoice.paidAt) {
        invoice.paidAt = new Date();
      }
      await invoice.save();
      return NextResponse.json({
        success: true,
        message: "Invoice updated successfully.",
        invoice,
      });
    }

    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

