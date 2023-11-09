const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');

const index = fs.readFileSync('./ips_main.html', 'utf-8');
const favicon = fs.readFileSync('./favicon.ico');
const app = express();

const serverPortNumber = process.env.SERVER_PORT || 8888;

let privateKey; 
let certificate;
let ca;
let credentials;
if  (fs.existsSync('./certs/ipsviewer2023.key') && fs.existsSync('./certs/ipsviewer2023.crt') && fs.existsSync('./certs/ipsviewer2023.ca-bundle') ) {
  privateKey  = fs.readFileSync('./certs/ipsviewer2023.key', 'utf-8');
  certificate = fs.readFileSync('./certs/ipsviewer2023.crt', 'utf-8');
  ca = fs.readFileSync('./certs/ipsviewer2023.ca-bundle', 'utf-8')
  credentials = {key: privateKey, cert: certificate, ca: ca};
}


app.use('/templates', express.static('templates'));
app.use('/samples', express.static('samples'));
app.use('/assets', express.static('assets'));

app.get(['/favicon.ico'], (req, res) => {
  res.send(favicon);
});

app.get(['/', '/index.html'], (req, res) => {
    res.send(index);
});

app.get('*', (req, res) => {
  res.redirect('/');
});

if (credentials) {
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(serverPortNumber);
  console.log(`listening on HTTPS port ${serverPortNumber}`);
} else {
  var httpServer = http.createServer(app);
  httpServer.listen(serverPortNumber);
  console.log(`listening on HTTP port ${serverPortNumber}`);
}
