const express = require("express");
const router = express.Router();
const db = require('./db');
const NodeRSA = require('node-rsa');
const config = require('./config');

var voteBuffer = {};

router.get('/get-pubkey', (req, res) => {
    if (!pemKey) {
        res.status(500).json({message: 'Server not ready'});
        return;
    }
    res.status(200).json({ key: pemKey.exportKey('public') });
});

router.post('/cast-vote', (req, res) => {
    if (typeof(req.body.userid) !== 'string' || typeof(req.body.password) !== 'string' ||
        typeof(req.body.option) !== 'string' || typeof(req.body.rhash) !== 'string') {
        res.status(401).json({message: 'Malformed request'});
        return;
    }
    const key = new NodeRSA(config.TOPubKey, 'public');
    const dec = key.decrypt(req.body.password);
    if (dec !== req.body.userId + config.electionId) {
        res.status(400).json({message: 'Invalid user-id/password'});
        return;
    }
});

module.exports = router;
