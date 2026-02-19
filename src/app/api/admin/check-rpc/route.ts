
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
    try {
        const { data, error } = await supabase.rpc("exec_sql", { sql: "SELECT 1" });
        return NextResponse.json({ success: !error, error: error?.message });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
