(async () => {
    const fs = require('fs/promises');
    const web3 = require("../ropsten_web3")
    
    const contractAddress = "0x6DCEcF0151026f7c788Cfb1481f2045b50EECbA6"
    const contract = new web3.eth.Contract(JSON.parse(await fs.readFile("./bin/GuessTheNumberChallenge.abi", "utf-8")), contractAddress)

    const account = web3.eth.accounts.privateKeyToAccount(await fs.readFile("../pk.txt", "utf-8"))
    
    console.log(await contract.methods.guess("42"));

    // Creating and signing a transaction
    const tx = {
        to: contractAddress,
        data: contract.methods.guess("42").encodeABI(),
        gas: await contract.methods.guess("42").estimateGas({
            from: account.address,
            value: web3.utils.toWei("1", "ether")
        }),
        gasPrice: web3.utils.toWei("35", "gwei"),
        value: web3.utils.toWei("1", "ether")
    }

    const signedTx = await account.signTransaction(tx)
    console.log(signedTx);

    // Sending
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

    console.log(`isComplete: ${await contract.methods.isComplete().call()}`);
})()