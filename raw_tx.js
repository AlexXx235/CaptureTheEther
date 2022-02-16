// 1. Create transaction object
// 2. Sign the transaction
// 3. Send the transaction

// Main account 0x18af16F0D2F48C62A52Ed0D3ECE72dA9E935aF05
// Test1 account 0x29d60E9fB12471bdfcd965FfF65e418E9a313302

(async () => {
    const fs = require("fs/promises")
    const web3 = require("./ropsten_web3")

    // Creating a transaction object
    const from = "0x18af16F0D2F48C62A52Ed0D3ECE72dA9E935aF05"
    const to = "0x29d60E9fB12471bdfcd965FfF65e418E9a313302"
    const tx = {
        from: from,
        to: to,
        value: web3.utils.toWei("0.5", "ether"),
        gas: 21000
    }
    
    // Getting private key
    const pk = await fs.readFile("pk.txt", "utf-8")

    // Singning the transaction object
    const signedTx = await web3.eth.accounts.signTransaction(tx, pk)
    console.log(signedTx);

    // Sending raw transaction
    try {
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

        // Checking the results
        console.log(`Main: ${web3.utils.fromWei(await web3.eth.getBalance(from))}`)
        console.log(`Test: ${web3.utils.fromWei(await web3.eth.getBalance(to))}`)
    } catch (err) {
        console.log(err)
    }
})()