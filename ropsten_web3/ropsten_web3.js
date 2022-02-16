const Web3 = require("web3")
let web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/1994eebec597447793d39580a2889db1"))
module.exports = web3