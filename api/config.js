const clientPort = 3001;
const serverPort = 3000;
const ipAddress = 'localhost';
const serverAddress = `${ipAddress}:${serverPort}`;
const clientAddress =  `${ipAddress}:${clientPort}`;

module.exports = {
    serverAddress: serverAddress,
    clientAddress: clientAddress
}
