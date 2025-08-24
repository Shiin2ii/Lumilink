const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
// Use service role key for backend to bypass RLS
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(1);
    
    if (error) {
      console.warn("Supabase connection failed:", error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn("Supabase error:", error.message);
    return false;
  }
};

module.exports = { supabase, testConnection };
