import { serve } from "https://deno.land/std/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { requireString } from "../_shared/validate.ts";
import { rateLimit } from "../_shared/rateLimit.ts";
import { getServiceClient } from "../_shared/supabase.ts";

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    rateLimit(ip);

    const { tracking_number } = await req.json();
    requireString(tracking_number, "tracking_number");

    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from("shipments")
      .select(`
        tracking_number,
        origin,
        destination,
        current_status,
        estimated_delivery,
        shipment_status_logs (
          status,
          location,
          notes,
          created_at
        )
      `)
      .eq("tracking_number", tracking_number)
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ error: "Shipment not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: corsHeaders }
    );
  }
});
