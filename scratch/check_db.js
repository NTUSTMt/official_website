
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEquipment() {
  const { data, error } = await supabase
    .from('equipment')
    .select('*');

  if (error) {
    console.error('Error fetching equipment:', error);
    return;
  }

  console.log('Equipment List:');
  data.forEach(item => {
    console.log(`- ID: ${item.id}, Name: "${item.name}", Qty: ${item.quantity}, Avail: ${item.available_qty}`);
  });
}

checkEquipment();
