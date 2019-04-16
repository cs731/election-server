const config = require('./config');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/44a3d41d2009422db9667c1ff2d52180"));
var abi = require('./abi.json')
var contr = new web3.eth.Contract(abi, "0xa8ae357cb81c1c9d0597caa5305deb1f7123a0c1")


module.exports.castVote = (u, p, r, o, s, i) => {
    console.log(u, p, r, o, s, i);
    return contr.methods.castVote(u, p, r, o, s, i).call({
        from: "0xbf5fbce8b1a5fb86412e637c3cf012d63fdb9cd8"
    })
    .then(res => res)
    .then(r => {
        console.log('here')
        console.log(r);
    });
};
