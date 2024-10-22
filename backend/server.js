const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Redirect to GitHub for login
app.get('/login', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=public_repo`;
  res.redirect(githubAuthUrl);
});

// OAuth callback URL where GitHub will redirect
app.get('/oauth/callback', async (req, res) => {
  const requestToken = req.query.code;
  
  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: requestToken,
    }, {
      headers: { 'Accept': 'application/json' }
    });
    
    const accessToken = tokenResponse.data.access_token;
    
    // At this point, you can use the access token with Decap CMS or GitHub API
    // For demo purposes, we'll just show the token
    res.send(`Access Token: ${accessToken}`);
    
  } catch (error) {
    res.status(500).send('Error exchanging code for access token');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
