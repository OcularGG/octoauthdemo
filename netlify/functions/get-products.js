const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    // Access the API token securely from environment variables
    const apiToken = process.env.FOURTHWALL_API_TOKEN;
    
    if (!apiToken) {
      console.log("API token not found in environment variables");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API token not configured' })
      };
    }
    
    console.log("Making request to Fourthwall API...");
    
    // Make request to Fourthwall API
    const response = await fetch('https://api.fourthwall.com/api/shops/products', {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`API error response: ${errorText}`);
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Products found: ${data.products ? data.products.length : 0}`);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data.products || [])
    };
    
  } catch (error) {
    console.error('Error fetching products:', error.message);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch products from Fourthwall', details: error.message })
    };
  }
};
