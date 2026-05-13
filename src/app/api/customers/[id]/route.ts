import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  badRequest,
  conflict,
  isRecord,
  notFound,
  ValidationError
} from "@/lib/api-validation";
import {
  buildCustomerUpdateInput,
  customerSelect,
  serializeCustomer
} from "@/lib/customer-input";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: {
      id
    },
    select: customerSelect
  });

  if (!customer) {
    return notFound("Customer not found.");
  }

  return NextResponse.json(serializeCustomer(customer));
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!isRecord(body)) {
      return badRequest("Invalid request body.");
    }

    const customer = await prisma.customer.update({
      where: {
        id
      },
      data: buildCustomerUpdateInput(body),
      select: customerSelect
    });

    return NextResponse.json(serializeCustomer(customer));
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequest(error.message);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return conflict("A customer with this email or document already exists.");
      }

      if (error.code === "P2025") {
        return notFound("Customer not found.");
      }
    }

    throw error;
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    await prisma.customer.delete({
      where: {
        id
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFound("Customer not found.");
    }

    throw error;
  }
}
