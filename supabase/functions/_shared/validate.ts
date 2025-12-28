export function requireString(value: unknown, name: string) {
  if (!value || typeof value !== "string") {
    throw new Error(`${name} is required`);
  }
  return value;
}
