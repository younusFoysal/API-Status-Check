// api/index.js
const express = require('express');
const app = express();

// APIStatus endpoint
app.get('/APIStatus', (req, res) => {
    const { hostname, socket, secure } = req;
    const { remotePort, remoteAddress } = socket;

    const sslConnection = secure ? 'SSL connection' : 'Non-SSL connection';

    const responseText = `
* About to connect() to ${hostname} port ${remotePort}
* Trying ${remoteAddress}...
* Connected to ${hostname} (${remoteAddress}) port ${remotePort}
* ${sslConnection}
> GET /APIStatus HTTP/1.1
> User-Agent: ${req.headers['user-agent']}
> Host: ${hostname}
> Accept: ${req.headers['accept']}
> Authorization: ${req.headers['authorization']}
> via: ${req.headers['via'] || 'N/A'}
< transfer-encoding: ${req.headers['transfer-encoding'] || 'N/A'}
<
* Connection #0 to host ${hostname} left intact
`;

    res.status(200).send(responseText);
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Interconnect Server is Running...');
});

module.exports = app;
