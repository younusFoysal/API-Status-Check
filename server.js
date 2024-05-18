const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Load SSL certificate and key
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'server.cert'))
};

// Middleware to capture connection details
app.use((req, res, next) => {
    req.connectionDetails = {
        aboutToConnect: `About to connect() to ${req.hostname} port ${req.socket.remotePort}`,
        trying: `Trying ${req.socket.remoteAddress}...`,
        connected: `Connected to ${req.hostname} (${req.socket.remoteAddress}) port ${req.socket.remotePort}`,
        initializingNSS: `Initializing NSS with certpath: sql:/etc/pki/nssdb`,
        cafile: `CAfile: certs/DigiCert Global G2 TLS RSA SHA256 2020 CA1.crt`,
        capath: `CApath: none`,
        sslConnection: `SSL connection using TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`,
        serverCertificate: ''
    };

    if (req.secure && req.socket.getPeerCertificate) {
        const cert = req.socket.getPeerCertificate();
        if (cert) {
            req.connectionDetails.serverCertificate = `Server certificate:
            subject: ${cert.subject ? cert.subject.CN : 'N/A'}
            start date: ${cert.valid_from ? cert.valid_from : 'N/A'}
            expire date: ${cert.valid_to ? cert.valid_to : 'N/A'}
            common name: ${cert.subject ? cert.subject.CN : 'N/A'}
            issuer: ${cert.issuer ? cert.issuer.CN : 'N/A'}`;
        } else {
            req.connectionDetails.serverCertificate = 'Server certificate not available';
        }
    }

    next();
});

// APIStatus endpoint
app.get('/APIStatus', (req, res) => {
    const connectionDetails = req.connectionDetails;
    const responseText = `
* ${connectionDetails.aboutToConnect}
* ${connectionDetails.trying}
* ${connectionDetails.connected}
${connectionDetails.initializingNSS ? `* ${connectionDetails.initializingNSS}` : ''}
${connectionDetails.cafile ? `* ${connectionDetails.cafile}` : ''}
${connectionDetails.capath ? `* ${connectionDetails.capath}` : ''}
${connectionDetails.sslConnection ? `* ${connectionDetails.sslConnection}` : ''}
${connectionDetails.serverCertificate ? `* ${connectionDetails.serverCertificate}` : ''}
> GET /APIStatus HTTP/1.1
> User-Agent: curl/7.29.0
> Host: ${req.hostname}
> Accept: */*
> Authorization: Bearer <token>
>
< HTTP/1.1 200 OK
< server: express
< date: ${new Date().toUTCString()}
< content-type: text/html; charset=UTF-8
< via: 1.1 google
< transfer-encoding: chunked
<
* Connection #0 to host ${req.hostname} left intact
`;

    res.status(200).send(responseText);
});

// Create HTTPS server
https.createServer(sslOptions, app).listen(port, () => {
    console.log(`HTTPS Server running at https://localhost:${port}`);
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Interconnect Server is Running...')
});
