// Quick verification script to test Supabase connection and seeded data
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://binkmipqlnouhdotgafz.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmttaXBxbG5vdWhkb3RnYWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTMyNjEsImV4cCI6MjA4NzAyOTI2MX0.7vB88ViHuUZh_htQy4B7JALiGf1c2jwse5r3lLqjBuA'
);

async function verify() {
    console.log('🔍 Verifying Supabase connection...\n');

    // 1. Check dealers
    const { data: dealers, error: dealerErr } = await supabase.from('dealers').select('*');
    if (dealerErr) console.error('❌ Dealers error:', dealerErr.message);
    else console.log(`✅ Dealers: ${dealers.length} found`);
    dealers?.forEach(d => console.log(`   ${d.code} → ${d.display_name} (${d.display_city})`));

    // 2. Check tier config
    const { data: tiers, error: tierErr } = await supabase.from('tier_config').select('*').order('sort_order');
    if (tierErr) console.error('❌ Tiers error:', tierErr.message);
    else console.log(`\n✅ Tiers: ${tiers.length} configured`);
    tiers?.forEach(t => console.log(`   ${t.sort_order}. ${t.name} — $${t.volume_requirement} — ${t.platform_fee_pct}% fee — Level ${t.eligible_level} — ${t.visibility}`));

    // 3. Check commission rates
    const { data: rates, error: rateErr } = await supabase.from('commission_rates').select('*').order('level');
    if (rateErr) console.error('❌ Commission rates error:', rateErr.message);
    else console.log(`\n✅ Commission Rates: ${rates.length} levels`);
    rates?.forEach(r => console.log(`   L${r.level}: ${r.commission_rate}% — ${r.label} — ${r.is_active ? 'ACTIVE' : 'INACTIVE'}`));

    // 4. Check house user
    const { data: house, error: houseErr } = await supabase.from('users').select('*').eq('referral_code', 'LUXEY-HOUSE');
    if (houseErr) console.error('❌ House user error:', houseErr.message);
    else console.log(`\n✅ House User: ${house?.[0]?.full_name} (${house?.[0]?.referral_code})`);

    // 5. Check platform config
    const { data: config, error: configErr } = await supabase.from('platform_config').select('*');
    if (configErr) console.error('❌ Platform config error:', configErr.message);
    else console.log(`\n✅ Platform Config: ${config.length} keys`);
    config?.forEach(c => console.log(`   ${c.key} = ${JSON.stringify(c.value)}`));

    console.log('\n🎉 Verification complete!');
}

verify();
