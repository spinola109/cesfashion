import type { Prisma } from "@prisma/client";
import {
  isRecord,
  optionalArray,
  optionalBoolean,
  optionalString,
  requiredString,
  ValidationError
} from "@/lib/api-validation";

export const customerSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  document: true,
  createdAt: true,
  updatedAt: true,
  addresses: {
    orderBy: {
      createdAt: "desc"
    }
  },
  _count: {
    select: {
      orders: true
    }
  }
} satisfies Prisma.CustomerSelect;

export function buildCustomerCreateInput(body: Record<string, unknown>) {
  assertNoPlainPassword(body);

  const email = requiredString(body, "email").toLocaleLowerCase("pt-BR");

  if (!email.includes("@")) {
    throw new ValidationError("email must be valid.");
  }

  const addresses = parseAddresses(body);

  return {
    name: requiredString(body, "name"),
    email,
    phone: optionalString(body, "phone"),
    document: optionalString(body, "document"),
    passwordHash: optionalString(body, "passwordHash"),
    addresses: addresses.length ? { create: addresses } : undefined
  } satisfies Prisma.CustomerCreateInput;
}

export function buildCustomerUpdateInput(body: Record<string, unknown>) {
  assertNoPlainPassword(body);

  const data: Prisma.CustomerUpdateInput = {};

  if ("name" in body) {
    data.name = requiredString(body, "name");
  }

  if ("email" in body) {
    const email = requiredString(body, "email").toLocaleLowerCase("pt-BR");

    if (!email.includes("@")) {
      throw new ValidationError("email must be valid.");
    }

    data.email = email;
  }

  if ("phone" in body) {
    data.phone = optionalString(body, "phone") ?? null;
  }

  if ("document" in body) {
    data.document = optionalString(body, "document") ?? null;
  }

  if ("passwordHash" in body) {
    data.passwordHash = optionalString(body, "passwordHash") ?? null;
  }

  if ("addresses" in body) {
    data.addresses = {
      deleteMany: {},
      create: parseAddresses(body)
    };
  }

  return data;
}

export function serializeCustomer(
  customer: Prisma.CustomerGetPayload<{ select: typeof customerSelect }>
) {
  return {
    ...customer,
    ordersCount: customer._count.orders,
    _count: undefined
  };
}

function parseAddresses(
  body: Record<string, unknown>
): Prisma.CustomerAddressCreateWithoutCustomerInput[] {
  return optionalArray(body, "addresses").map((item) => {
    if (!isRecord(item)) {
      throw new ValidationError("Each address must be an object.");
    }

    return {
      label: optionalString(item, "label"),
      recipient: requiredString(item, "recipient"),
      street: requiredString(item, "street"),
      number: requiredString(item, "number"),
      complement: optionalString(item, "complement"),
      neighborhood: optionalString(item, "neighborhood"),
      city: requiredString(item, "city"),
      state: requiredString(item, "state"),
      zipCode: requiredString(item, "zipCode"),
      isDefault: optionalBoolean(item, "isDefault") ?? false
    };
  });
}

function assertNoPlainPassword(body: Record<string, unknown>) {
  if ("password" in body) {
    throw new ValidationError(
      "Do not send plain text passwords. Send passwordHash only after hashing."
    );
  }
}
