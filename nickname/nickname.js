(async () => {
    const fs = require('fs/promises');
    const web3 = require("../ropsten_web3")
    
    const contractAddress = "0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee"
    const contract = new web3.eth.Contract(JSON.parse(await fs.readFile("./bin/CaptureTheEther.abi", "utf-8")), contractAddress)
    
    const account = web3.eth.accounts.privateKeyToAccount(await fs.readFile("../pk.txt", "utf-8"))
    
    // Creating and signing a transaction
    const tx = {
        to: contractAddress,
        data: contract.methods.setNickname(web3.utils.toHex("Alex")).encodeABI(),
        gas: await contract.methods.setNickname(web3.utils.toHex("Alex")).estimateGas(),
        gasPrice: web3.utils.toWei("35", "gwei")
    }
    const signedTx = await account.signTransaction(tx)
    console.log(signedTx);
    
    // Sending
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

    console.log(`Nickname: ${await contract.methods.nicknameOf(account.address).call()}`);
})()