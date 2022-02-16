(async () => {
    const fs = require('fs/promises');
    const web3 = require("../ropsten_web3")
    
    const contractAddress = "0xa13B626E918F24B830f730690B00cc77c78d07af"
    const contract = new web3.eth.Contract(JSON.parse(await fs.readFile("./bin/CallMeChallenge.abi", "utf-8")), contractAddress)
    
    const account = web3.eth.accounts.privateKeyToAccount(await fs.readFile("../pk.txt", "utf-8"))
    
    // Creating and signing a transaction
    const tx = {
        to: contractAddress,
        data: contract.methods.callme().encodeABI(),
        gas: await contract.methods.callme().estimateGas()
    }
    const signedTx = await account.signTransaction(tx)
    console.log(signedTx);
    
    // Sending
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

    console.log(`isComplete: ${await contract.methods.isComplete().call()}`);
})()