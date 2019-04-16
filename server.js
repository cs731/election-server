const express = require('express');
const app = express();
const port = 4000;
const fs = require('fs');
const NodeRSA = require('node-rsa');
const config = require('./config');
const db = require('./db');
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require('path');
const cparser = require('cookie-parser');
const crypto = require('crypto');
const routes = require('./routes');
const cors = require('cors');

//enable POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cparser());
app.use(cors());

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream })); // log every request to the console
app.use(morgan('dev'));
app.use(
    (req, res, next) => {
        if (!config.pemKey())
            res.status(500).json({message: 'Server not ready. Please try again after few seconds'});
        else
            next();
    }
);

app.use('/', routes);
app.listen(port, () => console.log(`Trusted Organization app listening on port ${port}!`));
