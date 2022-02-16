// for solcjs v0.4.21
const fs = require('fs')
const path = require('path')
const solc = require('solc')

function parseArgs() {
    const args = process.argv.slice(2)
    if (args.length != 2) {
        console.log(`Parametres of ${path.basename(__filename)}:\n1st - input_dir\n2nd - output_dir`)
        process.exit()
    } else {
        return {
            inputDir: path.resolve(args[0]),
            outputDir: path.resolve(args[1])
        }
    }
}

function getSolFiles(inputDir) {
    try {
        const dirFiles = fs.readdirSync(inputDir)
        const solFiles = dirFiles.filter(file => {
            return path.extname(file) === '.sol'
        })
        if (solFiles.length === 0) {
            console.log(`There are no .sol files in ${inputDir}`)
            process.exit()
        } else {
            return solFiles.map(file => {
                return path.join(inputDir, file)
            })
        }
    } catch (e) {
        console.log(e.message)
        process.exit()
    }
}

function compileFiles(solFiles) {
    for (const file of solFiles) {
        console.log(file)
        const code = fs.readFileSync(file, 'utf-8')
        const solcOutput = solc.compile(code)
        if (solcOutput.errors) {
            solcOutput.errors.forEach(console.log)
            continue
        } else {
            console.log(`${file} - Success`)
            return solcOutput
        }
    }
}

function saveSolcOutput(solcOutput, output_dir) {
    fs.mkdirSync(output_dir, {recursive: true})
    for (const contract in solcOutput.contracts) {
        try {
            const contractName = contract.slice(1)
            console.log(`Writing: ${contractName}`)
            const abiFile = contractName + '.abi'
            const binFile = contractName + '.bin'
            fs.writeFileSync(path.join(output_dir, abiFile), solcOutput.contracts[contract].interface)
            fs.writeFileSync(path.join(output_dir, binFile), solcOutput.contracts[contract].bytecode)
            console.log('Success')
        } catch (e) {
            console.log(e.message)
            continue
        }
    }
}

const paths = parseArgs()
const solFiles = getSolFiles(paths.inputDir)
const solcOutput = compileFiles(solFiles)
saveSolcOutput(solcOutput, paths.outputDir)
