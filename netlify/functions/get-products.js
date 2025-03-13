const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    // For debugging
    console.log("Function environment:", process.env.NODE_ENV);
    console.log("Function version:", process.version);
    
    const apiToken = process.env.FOURTHWALL_API_TOKEN;
    
    if (!apiToken) {
      console.error("API token missing! Make sure to set FOURTHWALL_API_TOKEN in Netlify");
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'API configuration error', details: 'Token not found' })
      };
    }
    
    // Try a different API endpoint (products endpoint)
    // We're changing this to use a more direct endpoint
    const response = await fetch('https://api.fourthwall.com/api/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log(`API status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    
    // Provide mock data if API returns no products
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log("No products found, returning mock data");
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify([{
          id: "mock1",
          name: "OCULAR T-Shirt",
          description: "A stylish t-shirt with the OCULAR logo.",
          price: { amount: 2500, currency: "USD" },
          images: [{ url: "https://via.placeholder.com/500x500?text=OCULAR+T-Shirt" }],
          url: "#"
        }, {
          id: "mock2",
          name: "OCULAR Hoodie",
          description: "Stay cozy with this premium OCULAR branded hoodie.",
          price: { amount: 4500, currency: "USD" },
          images: [{ url: "https://via.placeholder.com/500x500?text=OCULAR+Hoodie" }],
          url: "#"
        }])
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
    
  } catch (error) {
    console.error("Function error:", error.message);
    
    // Return mock products as fallback
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify([{
        id: "error1",
        name: "OCULAR T-Shirt",
        description: "A stylish t-shirt with the OCULAR logo. (Mock data due to API error)",
        price: { amount: 2500, currency: "USD" },
        images: [{ url: "https://via.placeholder.com/500x500?text=OCULAR+T-Shirt" }],
        url: "#"
      }])
    };
  }
};
