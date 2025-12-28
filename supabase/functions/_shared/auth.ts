export function requireAdmin(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) {
    throw new Error("Missing Authorization header");
  }
}
