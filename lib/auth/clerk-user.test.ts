import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isAdminFromSources,
  getRoleFromSessionClaims,
  getPrimaryEmail,
  isAdminRole,
  mapClerkUserToDbUser,
} from "./clerk-user";

describe("Clerk user helpers", () => {
  it("treats only publicMetadata.role === admin as admin", () => {
    assert.equal(isAdminRole({ role: "admin" }), true);
    assert.equal(isAdminRole({ role: "customer" }), false);
    assert.equal(isAdminRole({}), false);
    assert.equal(isAdminRole(null), false);
  });

  it("reads role from Clerk session metadata claims", () => {
    assert.equal(
      getRoleFromSessionClaims({ metadata: { role: "admin" } }),
      "admin"
    );
  });

  it("reads role from direct Clerk session role claims as a fallback", () => {
    assert.equal(getRoleFromSessionClaims({ role: "admin" }), "admin");
  });

  it("allows admins from the database when session claims do not include metadata", () => {
    assert.equal(
      isAdminFromSources({ sessionClaims: {}, databaseIsAdmin: true }),
      true
    );
  });

  it("does not allow non-admins when neither session claims nor database say admin", () => {
    assert.equal(
      isAdminFromSources({ sessionClaims: {}, databaseIsAdmin: false }),
      false
    );
  });

  it("uses Clerk primary email when available", () => {
    assert.equal(
      getPrimaryEmail({
        id: "user_123",
        primary_email_address_id: "email_2",
        email_addresses: [
          { id: "email_1", email_address: "first@example.com" },
          { id: "email_2", email_address: "primary@example.com" },
        ],
      }),
      "primary@example.com"
    );
  });

  it("falls back to a stable synthetic email if Clerk has no email address", () => {
    assert.equal(
      getPrimaryEmail({
        id: "user_123",
        primary_email_address_id: null,
        email_addresses: [],
      }),
      "user_123@clerk.local"
    );
  });

  it("maps Clerk user payloads to database user values", () => {
    const values = mapClerkUserToDbUser({
      id: "user_admin",
      primary_email_address_id: "email_admin",
      email_addresses: [
        { id: "email_admin", email_address: "admin@example.com" },
      ],
      first_name: "Ada",
      last_name: "Lovelace",
      image_url: "https://example.com/avatar.png",
      phone_numbers: [{ phone_number: "+15550000000" }],
      public_metadata: { role: "admin" },
    });

    assert.deepEqual(values, {
      clerkId: "user_admin",
      email: "admin@example.com",
      firstName: "Ada",
      lastName: "Lovelace",
      avatarUrl: "https://example.com/avatar.png",
      phone: "+15550000000",
      isAdmin: true,
    });
  });
});
