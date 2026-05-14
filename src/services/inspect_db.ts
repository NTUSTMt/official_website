import { supabase } from '../lib/supabase';

async function inspect() {
  const { data, error } = await supabase
    .from('cms_config')
    .select('*')
    .eq('id', 'global_config')
    .single();
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Columns in global_config:', Object.keys(data));
  }
}

inspect();
