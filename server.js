require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5500;

// Import configuration
const config = require('./auth/config');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || config.supabase.url,
  process.env.SUPABASE_KEY || config.supabase.key
);

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: config.session.maxAge * 1000 
  }
}));

// Serve static files
app.use(express.static(path.join(__dirname, '/')));

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login.html');
};

// Routes
app.get('/auth/login', (req, res) => {
  const clientId = process.env.DISCORD_CLIENT_ID || config.discord.clientId;
  const redirectUri = process.env.DISCORD_REDIRECT_URI || config.discord.redirectUri;
  const scope = config.discord.scope;
  
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`);
});

// Update callback route to match Netlify's path structure
app.get('/auth/discord/callback', async (req, res) => {
  // Same implementation as '/auth/callback'
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    // Exchange code for token
    const clientId = process.env.DISCORD_CLIENT_ID || config.discord.clientId;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET || config.discord.clientSecret;
    const redirectUri = process.env.DISCORD_REDIRECT_URI || config.discord.redirectUri;
    
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Error getting token:', tokenData);
      return res.redirect('/login.html?error=token_error');
    }

    // Get user data from Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });

    const userData = await userResponse.json();
    
    if (!userResponse.ok) {
      console.error('Error getting user data:', userData);
      return res.redirect('/login.html?error=user_data_error');
    }

    // Check if user exists in Supabase
    const { data: existingUser, error: findError } = await supabase
      .from(config.supabase.userTable)
      .select('*')
      .eq('discord_id', userData.id)
      .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('Error checking user:', findError);
      return res.redirect('/login.html?error=database_error');
    }

    let userId;

    if (!existingUser) {
      // Create new user if they don't exist
      const { data: newUser, error: createError } = await supabase
        .from(config.supabase.userTable)
        .insert([{
          discord_id: userData.id,
          username: userData.username,
          email: userData.email,
          avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
        }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return res.redirect('/login.html?error=registration_error');
      }

      userId = newUser.id;
    } else {
      userId = existingUser.id;
      
      // Update existing user data
      const { error: updateError } = await supabase
        .from(config.supabase.userTable)
        .update({
          username: userData.username,
          email: userData.email,
          avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`,
          last_login: new Date()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating user:', updateError);
        // Continue anyway, it's not critical
      }
    }

    // Store user in session
    req.session.user = {
      id: userId,
      discordId: userData.id,
      username: userData.username,
      email: userData.email,
      avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
    };

    // Redirect to dashboard or homepage
    res.redirect('/dashboard.html');
    
  } catch (error) {
    console.error('Auth callback error:', error);
    res.redirect('/login.html?error=server_error');
  }
});

// Keep the old callback route for local development
app.get('/auth/callback', async (req, res) => {
  // Same implementation as '/auth/discord/callback'
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    // Exchange code for token
    const clientId = process.env.DISCORD_CLIENT_ID || config.discord.clientId;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET || config.discord.clientSecret;
    const redirectUri = process.env.DISCORD_REDIRECT_URI || config.discord.redirectUri;
    
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Error getting token:', tokenData);
      return res.redirect('/login.html?error=token_error');
    }

    // Get user data from Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });

    const userData = await userResponse.json();
    
    if (!userResponse.ok) {
      console.error('Error getting user data:', userData);
      return res.redirect('/login.html?error=user_data_error');
    }

    // Check if user exists in Supabase
    const { data: existingUser, error: findError } = await supabase
      .from(config.supabase.userTable)
      .select('*')
      .eq('discord_id', userData.id)
      .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('Error checking user:', findError);
      return res.redirect('/login.html?error=database_error');
    }

    let userId;

    if (!existingUser) {
      // Create new user if they don't exist
      const { data: newUser, error: createError } = await supabase
        .from(config.supabase.userTable)
        .insert([{
          discord_id: userData.id,
          username: userData.username,
          email: userData.email,
          avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
        }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return res.redirect('/login.html?error=registration_error');
      }

      userId = newUser.id;
    } else {
      userId = existingUser.id;
      
      // Update existing user data
      const { error: updateError } = await supabase
        .from(config.supabase.userTable)
        .update({
          username: userData.username,
          email: userData.email,
          avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`,
          last_login: new Date()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating user:', updateError);
        // Continue anyway, it's not critical
      }
    }

    // Store user in session
    req.session.user = {
      id: userId,
      discordId: userData.id,
      username: userData.username,
      email: userData.email,
      avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
    };

    // Redirect to dashboard or homepage
    res.redirect('/dashboard.html');
    
  } catch (error) {
    console.error('Auth callback error:', error);
    res.redirect('/login.html?error=server_error');
  }
});

app.get('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

app.get('/api/user', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(req.session.user);
});

// Protected routes
app.get('/dashboard.html', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '/dashboard.html'));
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, req.path));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
