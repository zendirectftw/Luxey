import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase Admin client (Service Role) to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Sanitize filename (remove special chars, spaces)
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
        const fileName = `${Date.now()}-${sanitizedName}`;
        const filePath = `${fileName}`; // Upload to root of bucket

        // Convert file to ArrayBuffer for Supabase upload
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = new Uint8Array(arrayBuffer);

        const { data, error } = await supabaseAdmin.storage
            .from("product-images")
            .upload(filePath, fileBuffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from("product-images")
            .getPublicUrl(filePath);

        return NextResponse.json({ 
            url: publicUrl, 
            name: fileName 
        });

    } catch (error: any) {
        console.error("Upload API error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
