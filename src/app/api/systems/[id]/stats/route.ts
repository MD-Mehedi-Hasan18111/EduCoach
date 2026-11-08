import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Tenant } from "@/models/Tenant";
import { requireSuperAdmin } from "@/lib/auth-helper";

// GET /api/systems/[id]/stats: Inspect real-time counts from child system's dedicated database
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    await connectToDatabase();

    const tenant = await Tenant.findById(id);
    if (!tenant) {
      return NextResponse.json({ success: false, error: "System not found." }, { status: 404 });
    }

    if (!tenant.mongoUri) {
      return NextResponse.json({
        success: true,
        connected: false,
        message: "No custom MongoDB URI configured for this system.",
      });
    }

    let tenantConnection: mongoose.Connection | null = null;
    try {
      tenantConnection = await mongoose
        .createConnection(tenant.mongoUri, {
          bufferCommands: false,
          serverSelectionTimeoutMS: 4000,
        })
        .asPromise();

      // Query collections safely
      const collections = await tenantConnection.db?.listCollections().toArray();
      const collectionNames = collections?.map((c) => c.name) || [];

      let studentCount = 0;
      let teacherCount = 0;
      let batchCount = 0;
      let paymentCount = 0;
      let examCount = 0;

      if (collectionNames.includes("students")) {
        studentCount = await tenantConnection.db!.collection("students").countDocuments();
      }
      if (collectionNames.includes("teachers")) {
        teacherCount = await tenantConnection.db!.collection("teachers").countDocuments();
      }
      if (collectionNames.includes("batches")) {
        batchCount = await tenantConnection.db!.collection("batches").countDocuments();
      }
      if (collectionNames.includes("payments")) {
        paymentCount = await tenantConnection.db!.collection("payments").countDocuments();
      }
      if (collectionNames.includes("exams")) {
        examCount = await tenantConnection.db!.collection("exams").countDocuments();
      }

      await tenantConnection.close();

      return NextResponse.json({
        success: true,
        connected: true,
        databaseName: tenant.databaseName,
        totalCollections: collectionNames.length,
        collections: collectionNames,
        counts: {
          students: studentCount,
          teachers: teacherCount,
          batches: batchCount,
          payments: paymentCount,
          exams: examCount,
        },
      });
    } catch (err: any) {
      if (tenantConnection) {
        await tenantConnection.close().catch(() => {});
      }
      return NextResponse.json({
        success: true,
        connected: false,
        databaseName: tenant.databaseName,
        error: err.message,
        message: "Could not connect to child database. It may be restricted by IP access list or offline.",
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

