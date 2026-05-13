import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  badRequest,
  conflict,
  isRecord,
  optionalString,
  requiredString,
  ValidationError
} from "@/lib/api-validation";
import { prisma } from "@/lib/prisma";
import { serializeCategoryWithCount } from "@/lib/shop-serializers";
import { slugify } from "@/lib/slug";

const categoryInclude = {
  _count: {
    select: {
      products: true
    }
  }
} satisfies Prisma.CategoryInclude;

export async function GET() {
  const categories = await prisma.category.findMany({
    include: categoryInclude,
    orderBy: {
      name: "asc"
    }
  });

  return NextResponse.json(categories.map(serializeCategoryWithCount));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isRecord(body)) {
      return badRequest("Invalid request body.");
    }

    const name = requiredString(body, "name");
    const slug = optionalString(body, "slug") ?? slugify(name);

    if (!slug) {
      return badRequest("slug is required.");
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug
      },
      include: categoryInclude
    });

    return NextResponse.json(serializeCategoryWithCount(category), { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequest(error.message);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return conflict("A category with this slug already exists.");
    }

    throw error;
  }
}
