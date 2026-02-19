
import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;
function getSupabase() {
    if (!_supabase) {
        _supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    }
    return _supabase;
}

export async function GET() {
    try {
        const { data, error } = await getSupabase().rpc("exec_sql", { sql: "SELECT 1" });
        return NextResponse.json({ success: !error, error: error?.message });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
