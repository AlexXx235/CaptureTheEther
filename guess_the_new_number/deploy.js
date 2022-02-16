(async () => {
    try {
        const web3 = require('../ropsten_web3')
        const fs = require('fs')

        const account = web3.eth.accounts.privateKeyToAccount(fs.readFileSync("../pk.txt", "utf-8"))
    
        const contractAddress = '0x9F7439c83EcC71f6f726b9903ecF99B0e6cb2d78'
    
        const attackContractAbi = JSON.parse(fs.readFileSync('./bin/Guess.abi', 'utf-8'))
        const attackContractBin = fs.readFileSync('./bin/Guess.bin', 'utf-8')
    
        const attackContract = new web3.eth.Contract(attackContractAbi)
        const deployTx = await attackContract.deploy({
            data: attackContractBin,
            arguments: [contractAddress]
        })
        const deployData = deployTx.encodeABI()

        try {
            var gas = await deployTx.estimateGas({ from: account.address }) 
        } catch (e) {
            console.log('Gas estimation failed!');
            console.log(e.message);
            process.exit()
        }
        
        const tx = {
            data: deployData,
            gas: gas,
            gasPrice: web3.utils.toWei("35", "gwei")
        }
        const signedTx = await account.signTransaction(tx)

        console.log('Sending...');
        const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        console.log(txReceipt)
        
        fs.writeFileSync('./attack_contract_address.txt', txReceipt.contractAddress)        
    } catch (e) {
        console.log(e)
    }
})()