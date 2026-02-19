import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://binkmipqlnouhdotgafz.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmttaXBxbG5vdWhkb3RnYWZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1MzI2MSwiZXhwIjoyMDg3MDI5MjYxfQ.AuCtY5rsInWXoSEveEzGXL_oEjBL8nOi81MD4CZpC-w";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
    // 1. Check commissions table columns
    console.log("--- Checking commissions table structure ---");
    const { data: sample, error: sErr } = await supabase
        .from("commissions")
        .select("*")
        .limit(1);

    if (sErr) {
        console.error("Error reading commissions table:", sErr.message);
        console.log("The table may not exist or has RLS blocking service role. Trying to inspect...");
    } else if (sample && sample.length > 0) {
        console.log("Existing columns:", Object.keys(sample[0]));
        console.log("Sample row:", sample[0]);
    } else {
        console.log("Table exists but is empty. Columns unknown from query — will attempt insert.");
    }

    // 2. Fetch real users
    console.log("\n--- Fetching real users ---");
    const { data: users, error: uErr } = await supabase
        .from("users")
        .select("id, full_name, tier")
        .neq("referral_code", "LUXEY-HOUSE")
        .limit(10);

    if (uErr || !users?.length) {
        console.error("Could not fetch users:", uErr?.message);
        return;
    }
    console.log(`Found ${users.length} users:`, users.map(u => u.full_name).join(", "));

    // 3. Check if commissions already exist
    const { count } = await supabase
        .from("commissions")
        .select("*", { count: "exact", head: true });

    if (count && count > 0) {
        console.log(`\nCommissions table already has ${count} rows. Skipping seed.`);
        console.log("Delete existing rows first if you want to re-seed.");
        return;
    }

    // 4. Seed commissions
    const statuses = ["pending", "pending", "approved", "approved", "paid"];
    const amounts = [120, 85, 210, 45, 300, 175, 90, 155, 230, 60, 400, 320];

    const rows = [];
    const now = new Date();

    users.forEach((user, ui) => {
        const count = 2 + (ui % 3); // 2–4 commissions per user
        for (let i = 0; i < count; i++) {
            const daysAgo = Math.floor(Math.random() * 60);
            const date = new Date(now);
            date.setDate(date.getDate() - daysAgo);

            rows.push({
                user_id: user.id,
                amount: amounts[(ui * count + i) % amounts.length],
                status: statuses[(ui + i) % statuses.length],
                created_at: date.toISOString(),
            });
        }
    });

    console.log(`\n--- Inserting ${rows.length} commission records ---`);
    const { data: inserted, error: iErr } = await supabase
        .from("commissions")
        .insert(rows)
        .select("id, user_id, amount, status");

    if (iErr) {
        console.error("Insert failed:", iErr.message);
        console.log("\nFull error:", JSON.stringify(iErr, null, 2));
        console.log("\nThe commissions table might have different required columns.");
        console.log("Common additional columns: commission_type, level, purchase_order_id, referral_id");
    } else {
        console.log(`\n✅ Successfully seeded ${inserted?.length} commissions!`);
        const byStatus = inserted?.reduce((acc, r) => {
            acc[r.status] = (acc[r.status] || 0) + 1;
            return acc;
        }, {});
        console.log("Breakdown:", byStatus);
    }
}

main().catch(console.error);
