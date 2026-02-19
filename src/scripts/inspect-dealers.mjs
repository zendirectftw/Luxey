import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabase = createClient(
    "https://binkmipqlnouhdotgafz.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmttaXBxbG5vdWhkb3RnYWZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1MzI2MSwiZXhwIjoyMDg3MDI5MjYxfQ.AuCtY5rsInWXoSEveEzGXL_oEjBL8nOi81MD4CZpC-w"
);

const { data: dealers, error: e1 } = await supabase.from("dealers").select("*").limit(5);
const { data: mapping, error: e2 } = await supabase.from("dealer_product_mapping").select("*").limit(5);

fs.writeFileSync("dealers-schema.json", JSON.stringify({ dealers, mapping, e1, e2 }, null, 2));
console.log("Written to dealers-schema.json");
