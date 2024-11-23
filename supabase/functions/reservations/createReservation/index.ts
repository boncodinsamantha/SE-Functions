import { serve } from "https://deno.land/x/sift/mod.ts";

serve(async (req) => {
    if (req.method !== "POST") {
        return new Response("Only POST requests are allowed", { status: 405 });
    }

    const { roomId, guestId, startTime, endTime } = await req.json();

    if (!roomId || !guestId || !startTime || !endTime) {
        return new Response("Missing required fields", { status: 400 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js");
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    const { data, error } = await supabase
        .from("reservations")
        .insert([{ room_id: roomId, guest_id: guestId, start_time: startTime, end_time: endTime }]);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
});
