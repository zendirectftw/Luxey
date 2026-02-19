
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listTables() {
    const { data, error } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public");

    if (error) {
        // RLS might block reading information_schema directly with supabase client sometimes, 
        // but service key usually works. if not, we'll try a different way.
        console.error("Error:", error);
    } else {
        console.log("Tables:", data?.map(t => t.table_name));
    }
}

listTables();
