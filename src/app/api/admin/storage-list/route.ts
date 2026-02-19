import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Uses the service role key (server-side only) to bypass RLS on storage
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET() {
    // Try root first since that's where the user has uploaded images
    const { data, error } = await supabaseAdmin.storage
        .from("product-images")
        .list("", { limit: 500, sortBy: { column: "name", order: "asc" } });

    if (error) {
        return NextResponse.json({ files: [], error: error.message }, { status: 500 });
    }

    const files = (data ?? [])
        .filter((f) => f.name && !f.name.startsWith(".") && f.id) // skip folders / placeholders
        .map((f) => ({
            name: f.name,
            url: supabaseAdmin.storage
                .from("product-images")
                .getPublicUrl(f.name).data.publicUrl,
        }));

    return NextResponse.json({ files });
}
