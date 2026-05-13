import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  badRequest,
  conflict,
  isRecord,
  notFound,
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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: {
      id
    },
    include: categoryInclude
  });

  if (!category) {
    return notFound("Category not found.");
  }

  return NextResponse.json(serializeCategoryWithCount(category));
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!isRecord(body)) {
      return badRequest("Invalid request body.");
    }

    const name = "name" in body ? requiredString(body, "name") : undefined;
    const slug =
      "slug" in body
        ? requiredString(body, "slug")
        : name
          ? optionalString(body, "slug") ?? slugify(name)
          : undefined;

    const category = await prisma.category.update({
      where: {
        id
      },
      data: {
        name,
        slug
      },
      include: categoryInclude
    });

    return NextResponse.json(serializeCategoryWithCount(category));
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequest(error.message);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return conflict("A category with this slug already exists.");
      }

      if (error.code === "P2025") {
        return notFound("Category not found.");
      }
    }

    throw error;
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    await prisma.category.delete({
      where: {
        id
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFound("Category not found.");
    }

    throw error;
  }
}
