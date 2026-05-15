const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addEmojiColumn() {
  console.log('Checking for emoji column in equipment table...');
  
  // We can't easily check columns via JS client without a raw query
  // But we can try to select it and see if it fails
  const { error } = await supabase.from('equipment').select('emoji').limit(1);
  
  if (error && error.code === '42703') { // undefined_column
    console.log('Emoji column missing. Attempting to add it...');
    // Note: This requires the service role key and might still fail if not using SQL
    // In our project, we usually use SQL in the dashboard, but I'll try to use a dummy upsert 
    // to check if I can add it, or just rely on the user having it.
    // Actually, I'll just use RPC if available or recommend a SQL snippet.
    
    console.log('Please run this SQL in your Supabase dashboard:');
    console.log('ALTER TABLE equipment ADD COLUMN IF NOT EXISTS emoji TEXT;');
  } else if (error) {
    console.error('Error checking column:', error);
  } else {
    console.log('Emoji column already exists.');
  }
}

addEmojiColumn();
