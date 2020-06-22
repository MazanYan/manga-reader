const clientPort = 3001;
const serverPort = 3000;
const ipAddress = '192.168.0.109';
const serverAddress = `${ipAddress}:${serverPort}`;
const clientAddress =  `${ipAddress}:${clientPort}`;

module.exports = {
    serverAddress: serverAddress,
    clientAddress: clientAddress
}
