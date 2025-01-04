// Load environment variables from .env if dev server
const dotenv = require('dotenv');
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Initialize express server
const express = require('express');
const app = express()
const host = process.env.FBSIM_UI_DOMAIN || "0.0.0.0";
const port = process.env.FBSIM_UI_PORT || 8081;
const apiHost = process.env.FBSIM_API_HOST || "http://localhost:8080";
const config = {
  "net": {
    "simServiceHost": apiHost
  }
}

// Initialize server routes
app.set('view engine', 'hbs')
app.set('views', 'static/views')
app.use(express.static('static'))
app.get('/', (req, res) => {
  res.render("index", config)
})

// Listen on the configured port
const server = app.listen(port, host, () => {
  const address = server.address();
  console.log(`FBSim UI server listening on ${address.address}:${address.port}`);
  console.log(`Given host and port are: ${host}:${port}`);
})
