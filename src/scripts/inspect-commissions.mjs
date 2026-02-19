import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";

const s = createClient(
    "https://binkmipqlnouhdotgafz.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmttaXBxbG5vdWhkb3RnYWZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1MzI2MSwiZXhwIjoyMDg3MDI5MjYxfQ.AuCtY5rsInWXoSEveEzGXL_oEjBL8nOi81MD4CZpC-w"
);

const { data, error } = await s.from("commissions").select("*").limit(3);

const out = JSON.stringify({ error, data }, null, 2);
writeFileSync("commissions-schema.json", out);
console.log("Written to commissions-schema.json");
