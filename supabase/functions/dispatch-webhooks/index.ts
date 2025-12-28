import { serve } from "https://deno.land/std/http/server.ts";

serve(async () => {
  return new Response(
    JSON.stringify({ status: "webhooks dispatched" })
  );
});
