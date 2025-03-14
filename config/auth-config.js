// Configuration for Discord OAuth and Supabase
const config = {
  discord: {
    clientId: '1347996859326529556', // Application ID
    clientSecret: 'YOUR_DISCORD_CLIENT_SECRET', // Replace with actual Discord client secret
    redirectUri: 'https://octoauth.netlify.app/auth/callback',
    scope: 'identify email'
  },
  supabase: {
    url: 'YOUR_SUPABASE_URL', // Replace with your Supabase URL
    key: 'YOUR_SUPABASE_ANON_KEY', // Replace with your Supabase anon key
    userTable: 'users'
  },
  session: {
    cookieName: 'octoauth_session',
    secret: 'your-super-secret-key-change-this-in-production',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  }
};

module.exports = config;