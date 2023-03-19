/*
//Add the following lines on top of your other script tags inside your index.html
<script src="https://cdn.jsdelivr.net/npm/@alch/alchemy-web3@latest/dist/alchemyWeb3.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/web3@1.8.1/dist/web3.min.js"></script>
<script src="scripts/contractApi.js"> </script>
*/


/////////////////////////////
///////// ARBITRUM //////////
/////////////////////////////

const ethereumGoerliChainId = 0x5;
const ethereumId = 0x1


/////////////////////////////
/////////  HELPER  //////////
/////////////////////////////

function ToEth(wei) {
    return alchemyProvider.web3.utils.fromWei(wei, 'ether');
}
function ToWei(eth) {
    return alchemyProvider.web3.utils.toWei(eth.toString(), 'ether');
}
/////////////////////////////
// ALCHEMY ALCHEMY ALCHEMY //
/////////////////////////////



//alchemy setup
let alchemyProvider = {};
async function _setupAlchemyConnection(contractAddress, abi,rpcUrl) {
    var alchemyWeb3 = AlchemyWeb3.createAlchemyWeb3(rpcUrl);
    var tokenContract = await new alchemyWeb3.eth.Contract(abi, contractAddress);
    alchemyProvider = { contract: tokenContract, web3: alchemyWeb3,};
}
async function _setupAlchemyConnectionMint(contractAddress, abi, rpcUrl) {
    //console.log(abi);
    var alchemyWeb3 = AlchemyWeb3.createAlchemyWeb3(rpcUrl);
    var tokenContract = await new alchemyWeb3.eth.Contract(abi, contractAddress);
    alchemyProvider = { contract: tokenContract, web3: alchemyWeb3};
}

//general methods\\
async function _getLatestBlock(callback) {
    let result = 0;
    await alchemyProvider.web3.eth.getBlock("latest").then(block => {
        result = block;
    }).catch((error => {
        result = error;
    }));
    callback && callback(result);
    return result;
}



//contract methods\\ GET
async function _getTotalSupply() {
    let contract = new web3.eth.Contract(abi, contractAddress);
    let supply = await contract.methods.totalSupply().call();
    return supply;
  }


async function _getPublicPrice(callback) {
    var result = 0;
    await alchemyProvider.contract.methods
        .publicPrice()
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}


/////////////////////////
// WALLET WALLET WALLET //  
//////////////////////////

//wallet setup
let walletProvider = {}


async function setupWalletConnection(contractAddress, abi,callback) {
    if (window.ethereum === undefined) {
        callback && callback(false);
        console.log("No eth installed");
        return false;
    }

    if (!isEthAddress()) {
        const isEnabled = await window.ethereum.enable();
        const enable = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (isEnabled) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            walletProvider.account = accounts[0];
        }
    }
    if (isEthAddress()) {
        console.log(walletProvider.account);

        const nativeWeb3 = new Web3(window.ethereum);
        const tokenContract = new nativeWeb3.eth.Contract(abi, contractAddress);
        
        walletProvider = { account: walletProvider.account, contract: tokenContract, web3: nativeWeb3 };
    }

    callback && callback(isEthAddress());

    return isEthAddress();

}
async function setupWalletConnectionMint(contractAddress, abi, callback) {
    if (window.ethereum === undefined) {
        callback && callback(false);
        console.log("No eth installed");
        return false;
    }

    if (!isEthAddress()) {
        const isEnabled = await window.ethereum.enable();
        const enable = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (isEnabled) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            walletProvider.account = accounts[0];
        }
    }
    if (isEthAddress()) {
        console.log(walletProvider.account);

        const nativeWeb3 = new Web3(window.ethereum);
        const tokenContract = new nativeWeb3.eth.Contract(abi, contractAddress);
        walletProvider = { account: walletProvider.account, contract: tokenContract, web3: nativeWeb3 };
    }

    callback && callback(isEthAddress());

    return isEthAddress();

}
function isEthAddress() {
    return (
        !!walletProvider.account && /^(0x)?[0-9a-f]{40}$/i.test(walletProvider.account)
    );
}
//general methods\\
async function getBlockByNumber(nr, callback) {
    const result = await window.ethereum.request({
        params: [nr, false],
        method: 'eth_getBlockByNumber',
    });
    callback && callback(result);
    return result;
}
async function getBalance(callback) {
    const result = await window.ethereum.request({
        method: 'eth_getBalance',
    });
    callback && callback(result);
    return result;
}
async function getUserChain(callback) {
    const result = await window.ethereum.request({
        method: 'eth_chainId',
    });
    callback && callback(result);
    return result;
}
async function addTestNetwork(callback) {
    const result = await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
            chainId: "0x5",
            rpcUrls: ["https://goerli.infura.io/v3/231a1415f18649b385da356985171bc0"],
            chainName: "Ethereum Goerli",
            nativeCurrency: {
                name: "GoerliETH",
                symbol: "ETH",
                decimals: 18
            },
            blockExplorerUrls: ["https://goerli-etherscan.io/"]
        }]
    });
    console.log(result);
    callback && callback(result);
    return result;
}
async function addMainNetwork(callback) {
    const result = await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
            chainId: "0x1",
            rpcUrls: ["https://mainnet.infura.io/v3/231a1415f18649b385da356985171bc0"],
            chainName: "Ethereum",
            nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18
            },
            blockExplorerUrls: ["https://etherscan.io/"]
        }]
    });
    callback && callback(result);
    return result;
}
async function getBlockNumber(callback) {
    const result = await window.ethereum.request({
        method: 'eth_blockNumber',
    });
    callback && callback(result);
    return result;
}


async function getPublicPrice(callback) {
    var result = 0;
    await walletProvider.contract.methods
        .publicPrice()
        .call()
        .then((receipt) => {
            result = receipt;
        });
    callback && callback(result);
    return result;
}


//contract methods\\ SEND

async function mintVikings(quantity, price, callback) {
    let normalPrice = (tokenPrice) * quantity;
    console.log(normalPrice);
    let result = {};
    result.success = false;
    let gas = await walletProvider.contract.methods
        .mintVikings(quantity)
        .estimateGas({
            from: walletProvider.account,
            value: normalPrice,
        });
    gas = Math.round(gas * 1.2);
    await walletProvider.contract.methods
        .mintVikings(quantity)
        .send({
            from: walletProvider.account,
            value: normalPrice,
            gas: gas,
            maxFeePerGas: 100000001, // 1.5 Gwei
            maxPriorityFeePerGas: 100000000, // .5 Gwei
            type: '0x2'
        })
        .once('error', (err) => {
            result.success = false;
            result.data = err;
        })
        .then((receipt) => {
            result.success = true;
            result.data = receipt;
        });

    callback && callback(result);
    return result;
}
