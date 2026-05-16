import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import {
  type ClerkUserPayload,
  isAdminRole,
  mapClerkUserToDbUser,
} from "@/lib/auth/clerk-user";

export async function upsertClerkUser(data: ClerkUserPayload) {
  const values = mapClerkUserToDbUser(data);

  await db
    .insert(users)
    .values(values)
    .onConflictDoUpdate({
      target: users.clerkId,
      set: {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        avatarUrl: values.avatarUrl,
        phone: values.phone,
        isAdmin: values.isAdmin,
        updatedAt: new Date(),
      },
    });

  return values;
}

export async function syncCurrentClerkUserToDb() {
  const user = await currentUser();
  if (!user) return null;

  const payload: ClerkUserPayload = {
    id: user.id,
    primary_email_address_id: user.primaryEmailAddressId,
    email_addresses: user.emailAddresses.map((email) => ({
      id: email.id,
      email_address: email.emailAddress,
    })),
    first_name: user.firstName,
    last_name: user.lastName,
    image_url: user.imageUrl,
    phone_numbers: user.phoneNumbers.map((phone) => ({
      phone_number: phone.phoneNumber,
    })),
    public_metadata: user.publicMetadata,
  };

  return upsertClerkUser(payload);
}

export async function syncClerkUserByIdToDb(userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const payload: ClerkUserPayload = {
    id: user.id,
    primary_email_address_id: user.primaryEmailAddressId,
    email_addresses: user.emailAddresses.map((email) => ({
      id: email.id,
      email_address: email.emailAddress,
    })),
    first_name: user.firstName,
    last_name: user.lastName,
    image_url: user.imageUrl,
    phone_numbers: user.phoneNumbers.map((phone) => ({
      phone_number: phone.phoneNumber,
    })),
    public_metadata: user.publicMetadata,
  };

  return upsertClerkUser(payload);
}

export async function getCurrentUserAdminState() {
  const user = await currentUser();
  if (!user) return { user: null, isAdmin: false };

  return {
    user,
    isAdmin: isAdminRole(user.publicMetadata),
  };
}
