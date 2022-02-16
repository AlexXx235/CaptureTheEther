(async () => {
    const fs = require('fs/promises');
    const web3 = require("../ropsten_web3")    
    
    const contractAddress = "0x81075c7Cc71799c42b7DbEA71B5c69B759b6e83A"
    const contract = new web3.eth.Contract(JSON.parse(await fs.readFile("./bin/GuessTheRandomNumberChallenge.abi", "utf-8")), contractAddress)

    const account = web3.eth.accounts.privateKeyToAccount(await fs.readFile("../pk.txt", "utf-8"))

    // Obtaining the answer
    const answer = await web3.eth.getStorageAt(contractAddress, 0)
    console.log(`Slot0 (answer): ${answer}`)

    // Gas estimating
    try {
        var gas = await contract.methods.guess(answer.toString()).estimateGas({
            from: account.address,
            value: web3.utils.toWei("1", "ether")
        }) 
    } catch (e) {
        console.log('Gas estimation failed!');
        console.log(e.message);
        return
    }

    // Creating and signing a transaction
    const tx = {
        to: contractAddress,
        data: contract.methods.guess(answer.toString()).encodeABI(),
        gas: gas,
        gasPrice: web3.utils.toWei("35", "gwei"),
        value: web3.utils.toWei("1", "ether")
    }
    console.log(tx);

    const signedTx = await account.signTransaction(tx)
    console.log(signedTx);

    // Sending
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

    console.log(`isComplete: ${await contract.methods.isComplete().call()}`);
})()