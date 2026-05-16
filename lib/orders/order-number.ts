import { nanoid } from "nanoid";

export function generateOrderNumber() {
  return `CR-${Date.now().toString(36).toUpperCase().slice(-5)}${nanoid(3).toUpperCase()}`;
}
