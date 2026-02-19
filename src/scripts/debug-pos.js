
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://binkmipqlnouhdotgafz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmttaXBxbG5vdWhkb3RnYWZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1MzI2MSwiZXhwIjoyMDg3MDI5MjYxfQ.AuCtY5rsInWXoSEveEzGXL_oEjBL8nOi81MD4CZpC-w";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStatuses() {
  console.log("Fetching POs...");
  const { data, error } = await supabase
    .from("purchase_orders")
    .select("status");

  if (error) {
    console.error("Error fetching POs:", error);
    return;
  }

  const counts = {};
  data.forEach((po) => {
    counts[po.status] = (counts[po.status] || 0) + 1;
  });

  console.log("PO Status Counts:", counts);
}

checkStatuses();
