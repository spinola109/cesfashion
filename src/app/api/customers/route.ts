import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  badRequest,
  conflict,
  isRecord,
  ValidationError
} from "@/lib/api-validation";
import {
  buildCustomerCreateInput,
  customerSelect,
  serializeCustomer
} from "@/lib/customer-input";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const customers = await prisma.customer.findMany({
    orderBy: {
      createdAt: "desc"
    },
    select: customerSelect
  });

  return NextResponse.json(customers.map(serializeCustomer));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isRecord(body)) {
      return badRequest("Invalid request body.");
    }

    const customer = await prisma.customer.create({
      data: buildCustomerCreateInput(body),
      select: customerSelect
    });

    return NextResponse.json(serializeCustomer(customer), { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequest(error.message);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return conflict("A customer with this email or document already exists.");
    }

    throw error;
  }
}
