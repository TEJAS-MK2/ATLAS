import { createClient } from "npm:@supabase/supabase-js@2";

const url = Deno.env.get("SUPABASE_URL") ?? "";
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
if (!url || !serviceKey) throw new Error("Missing server credentials");
// Supabase deployment config: verify_jwt=false; this endpoint authorizes room writes with one-time capability tokens.
const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const origins = new Set(["https://tejas-mk2.github.io", "http://localhost:4173", "http://127.0.0.1:4173", "http://localhost:8080", "http://127.0.0.1:8080"]);
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && origins.has(origin) ? origin : "https://tejas-mk2.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Max-Age": "86400", "Vary": "Origin",
});
const reply = (data: unknown, status = 200, origin: string | null = null) =>
  new Response(JSON.stringify(data), { status, headers: { ...cors(origin), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
const enc = new TextEncoder();
const hex = (b: Uint8Array) => [...b].map(x => x.toString(16).padStart(2, "0")).join("");
async function hash(s: string) { return hex(new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(s)))); }
function token() { return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))).replaceAll("+","-").replaceAll("/","_").replaceAll("=",""); }
function uuid(v: unknown): v is string { return typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v); }
function validState(v: unknown): v is Record<string, unknown> {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  const s = v as Record<string, any>, c = s.center;
  if (!c || !Number.isFinite(c.lat) || !Number.isFinite(c.lng) || c.lat < -90 || c.lat > 90 || c.lng < -180 || c.lng > 180) return false;
  if (!Number.isInteger(s.zoom) || s.zoom < 2 || s.zoom > 19 || !["streets","light","dark","terrain","satellite"].includes(s.layer)) return false;
  if (s.pins !== undefined && (!Array.isArray(s.pins) || s.pins.length > 100 || s.pins.some((p: any) => !p || !Number.isFinite(p.lat) || !Number.isFinite(p.lng) || p.lat < -90 || p.lat > 90 || p.lng < -180 || p.lng > 180 || typeof p.name !== "string" || p.name.length > 80))) return false;
  return true;
}
async function limited(req: Request, action: string, max: number, seconds: number) {
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-real-ip") ?? "unknown";
  const { data, error } = await db.rpc("atlas_rate_limit", { p_key_hash: await hash("atlas:"+action+":"+ip), p_limit: max, p_window_seconds: seconds });
  if (error) throw new Error("Rate limiter unavailable");
  return data === true;
}
Deno.serve(async req => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (req.method !== "POST") return reply({ error: "Method not allowed" }, 405, origin);
  if (origin && !origins.has(origin)) return reply({ error: "Origin not allowed" }, 403, origin);
  if (Number(req.headers.get("content-length") ?? 0) > 300000) return reply({ error: "Request too large" }, 413, origin);
  try {
    const rawBody = await req.text();
    if (new TextEncoder().encode(rawBody).byteLength > 300000) return reply({ error: "Request too large" }, 413, origin);
    let body: unknown;
    try { body = JSON.parse(rawBody); } catch { return reply({ error: "Invalid JSON" }, 400, origin); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return reply({ error: "Invalid request" }, 400, origin);
    if (body.action === "create") {
      if (!await limited(req,"create",5,900)) return reply({ error: "Room creation limit reached" },429,origin);
      if (!validState(body.mapState)) return reply({ error: "Invalid map state" },400,origin);
      const editToken = token(), editHash = await hash(editToken);
      const title = typeof body.title === "string" ? body.title.replace(/[<>\u0000-\u001f]/g,"").trim().slice(0,120) || "Shared map" : "Shared map";
      const expiresAt = new Date(Date.now()+7*86400000).toISOString();
      const { data, error } = await db.rpc("atlas_create_shared_map",{p_title:title,p_map_state:body.mapState,p_edit_token_hash:editHash,p_expires_at:expiresAt});
      if (error || !uuid(data)) return reply({ error: "Could not create map room" },500,origin);
      return reply({ roomId:data, editToken, title, expiresAt },201,origin);
    }
    if (body.action === "get") {
      if (!await limited(req,"get",90,60)) return reply({ error: "Request limit reached" },429,origin);
      if (!uuid(body.roomId)) return reply({ error: "Invalid room link" },400,origin);
      const { data, error } = await db.rpc("atlas_get_shared_map",{p_id:body.roomId});
      if (error) return reply({ error: "Could not load room" },500,origin);
      const room = Array.isArray(data) ? data[0] : data;
      if (!room) return reply({ error: "Room not found or expired" },404,origin);
      return reply({ room },200,origin);
    }
    if (body.action === "update") {
      if (!await limited(req,"update",30,60)) return reply({ error: "Update limit reached" },429,origin);
      if (!uuid(body.roomId) || typeof body.editToken !== "string" || body.editToken.length < 30 || body.editToken.length > 100 || !validState(body.mapState)) return reply({ error: "Invalid update credentials or map state" },400,origin);
      const { data, error } = await db.rpc("atlas_update_shared_map",{p_id:body.roomId,p_edit_token_hash:await hash(body.editToken),p_map_state:body.mapState});
      if (error) return reply({ error: "Could not update room" },500,origin);
      if (data !== true) return reply({ error: "Edit permission invalid or room expired" },403,origin);
      return reply({ ok:true, updatedAt:new Date().toISOString() },200,origin);
    }
    return reply({ error: "Unknown action" },400,origin);
  } catch {
    return reply({ error: "Temporary service error" },500,origin);
  }
});
