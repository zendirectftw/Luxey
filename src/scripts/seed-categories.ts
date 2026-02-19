
import { createClient } from "@supabase/supabase-js";

// Hardcoded keys from .env.local for one-off script execution
const SUPABASE_URL = "https://binkmipqlnouhdotgafz.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmttaXBxbG5vdWhkb3RnYWZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1MzI2MSwiZXhwIjoyMDg3MDI5MjYxfQ.AuCtY5rsInWXoSEveEzGXL_oEjBL8nOi81MD4CZpC-w";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const metals = ["Gold", "Silver", "Platinum", "Palladium"];
const types = ["Bar", "Coin", "Round"];

async function seed() {
    console.log("Starting category using...");

    for (const metal of metals) {
        const metalSlug = metal.toLowerCase();
        
        // 1. Upsert Parent Category (Metal)
        console.log(`Processing Metal: ${metal}`);
        
        // Check if exists first to avoid overwriting unrelated fields if any
        let { data: parent, error: fetchError } = await supabase
            .from("categories")
            .select("id")
            .eq("slug", metalSlug)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error(`Error fetching parent ${metal}:`, fetchError);
            continue;
        }

        if (!parent) {
            const { data: newParent, error: insertError } = await supabase
                .from("categories")
                .insert({
                    name: metal,
                    slug: metalSlug,
                    description: `All ${metal} products`,
                    parent_id: null
                })
                .select("id")
                .single();
            
            if (insertError) {
                console.error(`Error creating parent ${metal}:`, insertError);
                continue;
            }
            parent = newParent;
            console.log(`Created parent: ${metal}`);
        } else {
            console.log(`Parent exists: ${metal}`);
        }

        // 2. Upsert Child Categories
        for (const type of types) {
            const typeLower = type.toLowerCase();
            const childName = `${metal} ${type}s`;
            const childSlug = `${metalSlug}-${typeLower}s`; // e.g., gold-bars

            let { data: child, error: childFetchError } = await supabase
                .from("categories")
                .select("id")
                .eq("slug", childSlug)
                .single();

            if (!child) {
                 const { error: childInsertError } = await supabase
                    .from("categories")
                    .insert({
                        name: childName,
                        slug: childSlug,
                        description: `${metal} ${type}s`,
                        parent_id: parent?.id
                    });
                
                if (childInsertError) {
                    console.error(`Error creating child ${childName}:`, childInsertError);
                } else {
                    console.log(`Created child: ${childName}`);
                }
            } else {
                console.log(`Child exists: ${childName}`);
            }
        }
    }
    
    // Also creating specific "All" categories? No, sticking to the requested structure.
    console.log("Seeding complete.");
}

seed().catch(console.error);
