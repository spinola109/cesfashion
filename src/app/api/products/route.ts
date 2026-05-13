import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  badRequest,
  conflict,
  isRecord,
  ValidationError
} from "@/lib/api-validation";
import { buildProductCreateInput } from "@/lib/product-input";
import { prisma } from "@/lib/prisma";
import { productInclude, serializeProduct } from "@/lib/shop-serializers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const active = searchParams.get("active");
  const query = searchParams.get("q")?.trim();

  const where: Prisma.ProductWhereInput = {};

  if (active !== null) {
    if (active !== "true" && active !== "false") {
      return badRequest("active must be true or false.");
    }

    where.isActive = active === "true";
  }

  if (category) {
    where.category = {
      slug: category
    };
  }

  if (query) {
    where.OR = [
      {
        name: {
          contains: query
        }
      },
      {
        description: {
          contains: query
        }
      }
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: productInclude,
    orderBy: {
      createdAt: "desc"
    }
  });

  return NextResponse.json(products.map(serializeProduct));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isRecord(body)) {
      return badRequest("Invalid request body.");
    }

    const product = await prisma.product.create({
      data: buildProductCreateInput(body),
      include: productInclude
    });

    return NextResponse.json(serializeProduct(product), { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequest(error.message);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return conflict("A product, image or variant with a unique value already exists.");
      }

      if (error.code === "P2025") {
        return badRequest("Related category was not found.");
      }
    }

    throw error;
  }
}
