
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkStatuses() {
  const { data, error } = await supabase
    .from("purchase_orders")
    .select("status");

  if (error) {
    console.error("Error fetching POs:", error);
    return;
  }

  const counts: Record<string, number> = {};
  data.forEach((po) => {
    counts[po.status] = (counts[po.status] || 0) + 1;
  });

  console.log("PO Status Counts:", counts);
}

checkStatuses();
