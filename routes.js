const express = require("express");
const router = express.Router();
const NodeRSA = require('node-rsa');
const config = require('./config');
const db = require('./db');
const bc = require('./blockchain');

function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

router.get('/api/get-pubkey', (req, res) => {
    if (!pemKey) {
        res.status(500).json({message: 'Server not ready'});
        return;
    }
    res.status(200).json({ key: pemKey.exportKey('public') });
});


router.post('/api/cast-vote', (req, res) => {
    console.log('Received vote request');
    if (typeof(req.body.userid) !== 'string' || typeof(req.body.password) !== 'string' ||
        typeof(req.body.option) !== 'string' || typeof(req.body.rhash) !== 'string') {
        res.status(401).json({message: 'Malformed request'});
        console.log('malformed request found. quitting');
        return;
    }
    if (!config.pemKey()) {
        res.status(500).json({message: 'Server not ready'});
        return;
    }
    console.log('Verifying the password')
    const key = new NodeRSA(config.TOPubKey, 'public');
    var b = Buffer.from(req.body.userid + config.electionId, 'base64');
    const dec = key.verify(b, req.body.password, 'base64', 'base64');
    if (!dec) {
        console.log('\t User verification failed. quitting');
        res.status(400).json({message: 'Invalid user-id/password'});
        return;
    }
    console.log('\tUser verified.')
    console.log('\tSigning receipt hash and password encrypting');
    var p = config.pemKey().sign(req.body.rhash, 'base64');

    var salt = makeid(32);
    console.log('\tPushing to database...');
    var e = config.encrypt(req.body.option + salt);
    db.conn().query(`INSERT INTO votes VALUES ("${req.body.userid}\", "${req.body.password}\", "${req.body.rhash}\", "${e.encryptedData}\", "${salt}\", "${e.iv}\", 0)`)
    .then(r => {
        console.log('\tPushed to the database. Pushing to config.votebuffer')
        config.voteBuffer.push({
            userid: req.body.userid,
            password: req.body.password,
            rhash: req.body.rhash,
            encryptedData: e.encryptedData,
            salt,
            iv: e.iv
        });
        if (config.voteCountCap <= config.voteBuffer.length) {
            var i1 = 0;
            var i2 = 0;
            while(i1 === i2) {
                i1 = Math.floor(Math.random()* config.voteCountCap)
                i2 = Math.floor(Math.random()* config.voteCountCap)
            }
            var tu= config.voteBuffer[i1].userid;
            var tp= config.voteBuffer[i1].password;
            config.voteBuffer[i1].userid = config.voteBuffer[i2].userid;
            config.voteBuffer[i1].password = config.voteBuffer[i2].password;
            config.voteBuffer[i2].userid = tu;
            config.voteBuffer[i2].password = tp;
            bc.castVote(config.voteBuffer[i1].userid, config.voteBuffer[i1].password, config.voteBuffer[i1].rhash, config.voteBuffer[i1].encryptedData, config.voteBuffer[i1].salt, config.voteBuffer[i1].iv)
            .then(() => {
                let a = db.conn().query(`DELETE FROM votes WHERE salt="${config.voteBuffer[i1].salt}";`);
                config.voteBuffer.splice(i1, 1);
                return a;
            }).then(a => {
                console.log(a,'askudjfhkj');
                return db.conn().query(` UPDATE votes SET userid="${tu}", password="${tp}" where salt="${config.voteBuffer[i2].salt}"`);
            }).then(r => {
                console.log(r, 'oipsjdafo');
                res.status(200).json({signature: p});
            });
        } else {
            res.status(200).json({signature: p});
        }
    })
});

module.exports = router;
