export interface ClerkEmailAddress {
  id: string;
  email_address: string;
}

export interface ClerkPhoneNumber {
  phone_number: string;
}

export interface ClerkUserPayload {
  id: string;
  primary_email_address_id?: string | null;
  email_addresses: ClerkEmailAddress[];
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  phone_numbers: ClerkPhoneNumber[];
  public_metadata?: Record<string, unknown> | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isAdminRole(metadata: Record<string, unknown> | null | undefined) {
  return metadata?.role === "admin";
}

export function getRoleFromSessionClaims(claims: unknown) {
  if (!isRecord(claims)) return undefined;

  const metadata = isRecord(claims.metadata) ? claims.metadata : null;
  const publicMetadata = isRecord(claims.publicMetadata)
    ? claims.publicMetadata
    : null;
  const role = metadata?.role ?? publicMetadata?.role ?? claims.role;

  return typeof role === "string" ? role : undefined;
}

export function isAdminSessionClaims(claims: unknown) {
  return getRoleFromSessionClaims(claims) === "admin";
}

export function isAdminFromSources({
  sessionClaims,
  databaseIsAdmin,
}: {
  sessionClaims: unknown;
  databaseIsAdmin?: boolean | null;
}) {
  return isAdminSessionClaims(sessionClaims) || databaseIsAdmin === true;
}

export function getPrimaryEmail(data: Pick<ClerkUserPayload, "id" | "primary_email_address_id" | "email_addresses">) {
  const primaryEmail = data.email_addresses.find(
    (email) => email.id === data.primary_email_address_id
  );

  return (
    primaryEmail?.email_address ??
    data.email_addresses[0]?.email_address ??
    `${data.id}@clerk.local`
  );
}

export function mapClerkUserToDbUser(data: ClerkUserPayload) {
  return {
    clerkId: data.id,
    email: getPrimaryEmail(data),
    firstName: data.first_name,
    lastName: data.last_name,
    avatarUrl: data.image_url,
    phone: data.phone_numbers[0]?.phone_number,
    isAdmin: isAdminRole(data.public_metadata),
  };
}
