const fs = require('fs');
const NodeRSA = require('node-rsa');

module.exports.electionId = " u8aosid;oias9 3io20p8asd fg jkl;s89q2w y9peos r9p sdafnjlkl;sdf";

module.exports.privateKeyFile = 'election-server.pem';

module.exports.usernameLength = 32;

module.exports.electionPassword = 'usdjiophuoasdhuosajidjidghuinuosedfiosadfsuidfnisdf';

module.exports.voteFlushTimeout = 600000;

module.exports.TOPubKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA567hW0MaymT7LRXEOWkt\nAoldq6qSVk5O3Q5DHTa8zvYCmUmjMj2sdhIN+TVDG1uPmZV728KQvU7XXtbsX248\nTiI8fHwhyAIz8JWHi8Eiauj0z4h64l7vuACMZu2ERFxg3UiTypBnqInJw0DEsKxn\npiOlaggx0gTAQcv8SLwjgB8Qt5xNuWfsWCDiEKCCm4L3ZmKC2xd7QEPLFuDIYVt2\nYwFyklVOFc5AlYXSpjYcnrEmAo/xyujgKcSnJhTM4rUfehYBEmh/KQN7cWkLK15P\ngCTSFE2gcBrEDiRqOto5joUsDk4xj5lPAA2GRE5Mvkweecrti0+J8jynFhJDu/3V\nhQIDAQAB\n-----END PUBLIC KEY-----"
// -----BEGIN PUBLIC KEY-----
// MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA567hW0MaymT7LRXEOWkt
// Aoldq6qSVk5O3Q5DHTa8zvYCmUmjMj2sdhIN+TVDG1uPmZV728KQvU7XXtbsX248
// TiI8fHwhyAIz8JWHi8Eiauj0z4h64l7vuACMZu2ERFxg3UiTypBnqInJw0DEsKxn
// piOlaggx0gTAQcv8SLwjgB8Qt5xNuWfsWCDiEKCCm4L3ZmKC2xd7QEPLFuDIYVt2
// YwFyklVOFc5AlYXSpjYcnrEmAo/xyujgKcSnJhTM4rUfehYBEmh/KQN7cWkLK15P
// gCTSFE2gcBrEDiRqOto5joUsDk4xj5lPAA2GRE5Mvkweecrti0+J8jynFhJDu/3V
// hQIDAQAB
// -----END PUBLIC KEY-----


var p = false;
module.exports.pemKey = () => p

fs.readFile(this.privateKeyFile, (err, data) => {
    if (err) {
        console.log('Unable to load pem file')
        process.exit(1);
    }
    p = new NodeRSA(data);
});


