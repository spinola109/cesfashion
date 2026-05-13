import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function requiredString(
  body: Record<string, unknown>,
  field: string,
  minLength = 1
) {
  const value = body[field];

  if (typeof value !== "string" || value.trim().length < minLength) {
    throw new ValidationError(`${field} is required.`);
  }

  return value.trim();
}

export function optionalString(body: Record<string, unknown>, field: string) {
  const value = body[field];

  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ValidationError(`${field} must be a string.`);
  }

  return value.trim();
}

export function optionalBoolean(body: Record<string, unknown>, field: string) {
  const value = body[field];

  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw new ValidationError(`${field} must be a boolean.`);
  }

  return value;
}

export function optionalArray(body: Record<string, unknown>, field: string) {
  const value = body[field];

  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new ValidationError(`${field} must be an array.`);
  }

  return value;
}

export function requiredDecimal(value: unknown, field: string) {
  if (value === undefined || value === null || value === "") {
    throw new ValidationError(`${field} is required.`);
  }

  return parseDecimal(value, field);
}

export function optionalDecimal(value: unknown, field: string) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return parseDecimal(value, field);
}

export function optionalInteger(body: Record<string, unknown>, field: string) {
  const value = body[field];

  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numberValue = typeof value === "string" ? Number(value) : value;

  if (!Number.isInteger(numberValue) || Number(numberValue) < 0) {
    throw new ValidationError(`${field} must be a positive integer.`);
  }

  return Number(numberValue);
}

export function notFound(message: string) {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function conflict(message: string) {
  return NextResponse.json({ error: message }, { status: 409 });
}

function parseDecimal(value: unknown, field: string) {
  const normalized =
    typeof value === "string" ? value.trim().replace(",", ".") : value;

  if (typeof normalized !== "string" && typeof normalized !== "number") {
    throw new ValidationError(`${field} must be a number.`);
  }

  try {
    const decimal = new Prisma.Decimal(normalized);

    if (!decimal.isFinite() || decimal.isNegative()) {
      throw new ValidationError(`${field} must be greater than or equal to zero.`);
    }

    return decimal;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(`${field} must be a valid number.`);
  }
}
