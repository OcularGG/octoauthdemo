const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');

// Load environment variables
const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI,
  SUPABASE_URL,
  SUPABASE_KEY,
  SESSION_SECRET
} = process.env;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

exports.handler = async (event, context) => {
  const path = event.path.replace(/\/\.netlify\/functions\/auth/, '');
  
  if (path === '/login') {
    return handleLogin();
  } else if (path === '/discord/callback') {
    return handleCallback(event);
  } else if (path === '/logout') {
    return handleLogout();
  } else if (path === '/user') {
    return handleUser(event);
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not found' })
    };
  }
};

function handleLogin() {
  const scope = 'identify email';
  
  return {
    statusCode: 302,
    headers: {
      Location: `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scope)}`
    }
  };
}

async function handleCallback(event) {
  const { code } = event.queryStringParameters;
  
  if (!code) {
    return {
      statusCode: 302,
      headers: {
        Location: '/login.html?error=no_code'
      }
    };
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: DISCORD_REDIRECT_URI
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Error getting token:', tokenData);
      return {
        statusCode: 302,
        headers: {
          Location: '/login.html?error=token_error'
        }
      };
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
      return {
        statusCode: 302,
        headers: {
          Location: '/login.html?error=user_data_error'
        }
      };
    }

    // Check if user exists in Supabase
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('discord_id', userData.id)
      .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('Error checking user:', findError);
      return {
        statusCode: 302,
        headers: {
          Location: '/login.html?error=database_error'
        }
      };
    }

    let userId;

    if (!existingUser) {
      // Create new user if they don't exist
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          discord_id: userData.id,
          username: userData.username,
          email: userData.email,
          avatar: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : null
        }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return {
          statusCode: 302,
          headers: {
            Location: '/login.html?error=registration_error'
          }
        };
      }

      userId = newUser.id;
    } else {
      userId = existingUser.id;
      
      // Update existing user data
      await supabase
        .from('users')
        .update({
          username: userData.username,
          email: userData.email,
          avatar: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : null,
          last_login: new Date()
        })
        .eq('id', userId);
    }

    // Create a JWT token for the user session
    const token = jwt.sign({
      sub: userId,
      discordId: userData.id,
      username: userData.username,
      email: userData.email || '',
      avatar: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : ''
    }, SESSION_SECRET, { expiresIn: '7d' });

    // Set the token in a cookie
    return {
      statusCode: 302,
      headers: {
        'Set-Cookie': cookie.serialize('octoauth_session', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'Lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        }),
        Location: '/dashboard.html'
      }
    };
    
  } catch (error) {
    console.error('Auth callback error:', error);
    return {
      statusCode: 302,
      headers: {
        Location: '/login.html?error=server_error'
      }
    };
  }
}

function handleLogout() {
  return {
    statusCode: 302,
    headers: {
      'Set-Cookie': cookie.serialize('octoauth_session', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        path: '/',
        maxAge: 0
      }),
      Location: '/'
    }
  };
}

function handleUser(event) {
  // Get the session cookie
  const cookies = cookie.parse(event.headers.cookie || '');
  const token = cookies.octoauth_session;
  
  if (!token) {
    return {
      statusCode: 401,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Not authenticated' })
    };
  }

  try {
    // Verify and decode the JWT
    const user = jwt.verify(token, SESSION_SECRET);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return {
      statusCode: 401,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Invalid token' })
    };
  }
}
