import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  badRequest,
  conflict,
  isRecord,
  notFound,
  ValidationError
} from "@/lib/api-validation";
import { buildProductUpdateInput } from "@/lib/product-input";
import { prisma } from "@/lib/prisma";
import { productInclude, serializeProduct } from "@/lib/shop-serializers";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: {
      id
    },
    include: productInclude
  });

  if (!product) {
    return notFound("Product not found.");
  }

  return NextResponse.json(serializeProduct(product));
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!isRecord(body)) {
      return badRequest("Invalid request body.");
    }

    const product = await prisma.product.update({
      where: {
        id
      },
      data: buildProductUpdateInput(body),
      include: productInclude
    });

    return NextResponse.json(serializeProduct(product));
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequest(error.message);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return conflict("A product or variant with this slug/sku already exists.");
      }

      if (error.code === "P2025") {
        return notFound("Product not found.");
      }
    }

    throw error;
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: {
        id
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return notFound("Product not found.");
      }

      if (error.code === "P2003") {
        return conflict("This product is linked to orders and cannot be deleted.");
      }
    }

    throw error;
  }
}
