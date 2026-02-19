
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        // Check if 'attributes' table exists
        const { data: attributes, error: attError } = await supabase
            .from("attributes")
            .select("*")
            .limit(1);

        // Check if 'attribute_values' table exists
        const { data: values, error: valError } = await supabase
            .from("attribute_values")
            .select("*")
            .limit(1);

        return NextResponse.json({
            attributesTable: !attError,
            attributesCount: attributes?.length || 0,
            attributeValuesTable: !valError,
            attributeValuesCount: values?.length || 0,
            errors: { attError, valError } 
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
