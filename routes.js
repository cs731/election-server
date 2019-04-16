const express = require("express");
const router = express.Router();
const db = require('./db');
const NodeRSA = require('node-rsa');
const config = require('./config');

var voteBuffer = {};

router.get('/api/get-pubkey', (req, res) => {
    if (!pemKey) {
        res.status(500).json({message: 'Server not ready'});
        return;
    }
    res.status(200).json({ key: pemKey.exportKey('public') });
});

router.post('/api/cast-vote', (req, res) => {
    if (typeof(req.body.userid) !== 'string' || typeof(req.body.password) !== 'string' ||
        typeof(req.body.option) !== 'string' || typeof(req.body.rhash) !== 'string') {
        res.status(401).json({message: 'Malformed request'});
        console.log('malformed requst');
        return;
    }
    if (!config.pemKey()) {
        res.status(500).json({message: 'Server not ready'});
        return;
    }
    const key = new NodeRSA(config.TOPubKey, 'public');
    var b = Buffer.from(req.body.userid + config.electionId, 'base64');
    const dec = key.verify(b, req.body.password, 'base64', 'base64');
    console.log(dec, 'sadiuobchnoiawsuhif');
    if (!dec) {
        res.status(400).json({message: 'Invalid user-id/password'});
        return;
    }
    var p = config.pemKey().sign(req.body.rhash, 'base64');
    res.status(200).json({signature: p});
});


router.get('/get-credentials', (req, res) => {
    var u = utils.makeUsername(config.usernameLength);
    // p = crypto.createHmac('sha256', pwd).digest('hex');
    res.status(200).json({ u, p });
});

module.exports = router;
