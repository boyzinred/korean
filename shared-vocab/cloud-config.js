/*
  cloud-config.js
  ----------------------------------------------------------------------------
  Where the stars sync to. Until `url` and `anonKey` are filled in, every page
  runs exactly as before, on this browser's storage alone.

    url       Supabase → Project Settings → API → Project URL
    anonKey   Supabase → Project Settings → API → the anon / publishable key.
              It is meant to be public: row-level security (supabase/schema.sql)
              is what keeps the rows yours.
    email     the address of the one account, created by hand in Supabase →
              Authentication → Users → Add user. It never receives mail; the
              login page only asks for the passcode and signs in as this
              address.
*/
window.KoreanCloudConfig = {
  url: "https://vyztpkbrwykingftgeiz.supabase.co",
  anonKey: "sb_publishable_kT_cQ26WzEyZDV2juwfzwQ_R3DawMAp",
  email: "me@example.com"
};
