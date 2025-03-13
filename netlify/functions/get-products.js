const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    // Access the API token securely from environment variables
    const apiToken = process.env.FOURTHWALL_API_TOKEN;
    
    if (!apiToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API token not configured' })
      };
    }
    
    // Make request to Fourthwall API
    const response = await fetch('https://api.fourthwall.com/api/shops/products', {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data.products || [])
    };
    
  } catch (error) {
    console.error('Error fetching products:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch products from Fourthwall' })
    };
  }
};
