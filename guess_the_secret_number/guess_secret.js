(async () => {
    const fs = require('fs/promises');
    const web3 = require("../ropsten_web3")    
    
    const contractAddress = "0x9F028E4112ce885C122C598CEF0059b45167D14F"
    const contract = new web3.eth.Contract(JSON.parse(await fs.readFile("./bin/GuessTheSecretNumberChallenge.abi", "utf-8")), contractAddress)

    const account = web3.eth.accounts.privateKeyToAccount(await fs.readFile("../pk.txt", "utf-8"))

    console.log(web3.utils.fromWei(await web3.eth.getBalance(contractAddress)));
    console.log(`isComplete: ${await contract.methods.isComplete().call()}`);
    return
    

    // Guessing the 8-bit number
    let guess, answer
    const answerHash = "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365"
    for (let i = 0; i < 256; i++) {
        guess = web3.utils.soliditySha3({type: "uint8", value: i.toString()})
        console.log(`${i}: ${guess}`);
        if (guess === answerHash) {
            console.log(`${i} Guessed!`);
            answer = i
            break
        }
    }

    // Creating and signing a transaction
    const tx = {
        to: contractAddress,
        data: contract.methods.guess(answer.toString()).encodeABI(),
        gas: await contract.methods.guess(answer.toString()).estimateGas({
            from: account.address,
            value: web3.utils.toWei("1", "ether")
        }),
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