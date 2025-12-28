import { serve } from "https://deno.land/std/http/server.ts";
import { requireAdmin } from "../_shared/auth.ts";
import { getServiceClient } from "../_shared/supabase.ts";

serve(async (req) => {
  try {
    requireAdmin(req);

    const { shipment_id, status, location, notes } = await req.json();
    const supabase = getServiceClient();

    await supabase.from("shipment_status_logs").insert({
      shipment_id,
      status,
      location,
      notes,
    });

    await supabase
      .from("shipments")
      .update({ current_status: status })
      .eq("id", shipment_id);

    return new Response(JSON.stringify({ success: true }));

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400 }
    );
  }
});
