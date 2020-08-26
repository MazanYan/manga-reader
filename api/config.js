const clientPort = 4001;
const serverPort = 4000;
const ipAddress = 'localhost';
const serverAddress = `${ipAddress}:${serverPort}`;
const clientAddress =  `${ipAddress}:${clientPort}`;

module.exports = {
    serverAddress,
    clientAddress,
    serverPort,
    clientPort,
}
