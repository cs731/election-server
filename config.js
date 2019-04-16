const fs = require('fs');
const NodeRSA = require('node-rsa');
const db = require('./db');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

module.exports.electionId = " u8aosid;oias9 3io20p8asd fg jkl;s89q2w y9peos r9p sdafnjlkl;sdf";

module.exports.privateKeyFile = 'election-server.pem';

module.exports.usernameLength = 32;

module.exports.electionPassword = '820999e7fc41a616e66067e78d4e052d9d74dcfdfa3a3c9c4520ec639fa39a55';
module.exports.iv = '6d95fddb9280e1cd85cb4a9627afef5b';

console.log(crypto.randomBytes(32).toString('hex'))
module.exports.voteFlushTimeout = 600000;

module.exports.TOPubKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA567hW0MaymT7LRXEOWkt\nAoldq6qSVk5O3Q5DHTa8zvYCmUmjMj2sdhIN+TVDG1uPmZV728KQvU7XXtbsX248\nTiI8fHwhyAIz8JWHi8Eiauj0z4h64l7vuACMZu2ERFxg3UiTypBnqInJw0DEsKxn\npiOlaggx0gTAQcv8SLwjgB8Qt5xNuWfsWCDiEKCCm4L3ZmKC2xd7QEPLFuDIYVt2\nYwFyklVOFc5AlYXSpjYcnrEmAo/xyujgKcSnJhTM4rUfehYBEmh/KQN7cWkLK15P\ngCTSFE2gcBrEDiRqOto5joUsDk4xj5lPAA2GRE5Mvkweecrti0+J8jynFhJDu/3V\nhQIDAQAB\n-----END PUBLIC KEY-----"

module.exports.voteCountCap = 5
module.exports.voteBuffer = []


var p = false;
module.exports.pemKey = () => p

fs.readFile(this.privateKeyFile, (err, data) => {
    if (err) {
        console.log('Unable to load pem file')
        process.exit(1);
    }
    p = new NodeRSA(data);
});

;

module.exports.encrypt = (text) => {
    console.log(module.exports.iv, 'ouhds')
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(module.exports.electionPassword, 'hex'), Buffer.from(module.exports.iv, 'hex'));
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: module.exports.iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

module.exports.decrypt = (text) => {
 let iv = Buffer.from(text.iv, 'hex');
 let encryptedText = Buffer.from(text.encryptedData, 'hex');
 let decipher = crypto.createDecipheriv(algorithm, Buffer.from(module.exports.electionPassword, 'hex'), Buffer.from(module.exports.iv, 'hex'));
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}

module.exports.init = () => {
    if (!db.conn()) {
        setTimeout(module.exports.init, 2000);
        return;
    }
    db.conn().query('SELECT * FROM votes').then(res => {
        console.log(res)
        res.forEach(e => {
            module.exports.voteBuffer.push({
                userid: e.userid,
                password: e.password,
                rhash: e.rhash,
                encryptedData: e.options,
                salt: e.salt,
                iv: e.iv
            });
        });
    })
}