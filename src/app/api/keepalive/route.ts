import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Called daily by Vercel Cron (see vercel.json) so the Supabase free-tier
// project never goes 7 days without activity and gets paused.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("products").select("id").limit(1);

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, at: new Date().toISOString() });
}
