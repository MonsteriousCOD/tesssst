/*
let blockchain = {};
let contractAddress = "0xb018b17aE9DCA2b684cd05CD07a81bFf8Cc17E8C";
let mintingPrice = 0;
function isEthAddress() {
  return (
    !!blockchain.account && /^(0x)?[0-9a-f]{40}$/i.test(blockchain.account)
  );
}
function setAddress(addr){
  contractAddress=addr;
  console.log("Address set to " + contractAddress);
}
async function connect(callback) {
  
  if (window.ethereum === undefined) {
    console.log("WEB3 UNDEFINED")
    callback && callback(false);
    console.warn('no eth installed');
    return false;
  }
  if (!isEthAddress()) {
    console.log("WEB3 DETECT")
    const isEnabled = await window.ethereum.enable();
    if (isEnabled) {
      console.log("WEB3 DETECTED")
      const accounts = await window.ethereum.request({method: 'eth_accounts'});
      blockchain.account = accounts[0];
    }
  }
 
  console.log("Contracct is: " + contractAddress.length);
  if (isEthAddress()) {
    console.log("WEB3 FINE")
    const web3 = new Web3(window.ethereum);
    const myContract = new web3.eth.Contract(abi,contractAddress);
    blockchain = {account: blockchain.account,myContract,web3,};
  }
  callback && callback(isEthAddress());
  return isEthAddress();
}
async function mintVikings(quantity,successContaier) {
  let publicPrice = 10000000000000000;
  let normalPrice = price * quantity;
  if (!(await connect())) {
    console.log('No Connection to eth');
    return;
  }
  try {
    let gas = await blockchain.myContract.methods
      .mintVikings(quantity)
      .estimateGas({
        from: blockchain.account,
        value: normalPrice,
      });
    console.log("ESTIMATED GAS0: " + gas);
    gas *= 1.2;
    gas = Math.round(gas);
    blockchain.myContract.methods
      .mintVikings(quantity)
      .send({
        from: blockchain.account,
        value: normalPrice,
        gas: gas,
        maxFeePerGas: 2500000001, // 1.5 Gwei
        maxPriorityFeePerGas: 2000000000, // .5 Gwei
        type: '0x2'
      })
      .once('error', (err) => {
        console.log(err);
      })
      .then((receipt) => {
        console.log(receipt);
        successContaier.style.visibility = 'visible';
      });
  }
  catch (error) {
    console.log(error);
  }
}
async function getPublicPrice(callback) {
  let price = 0;
  await blockchain.myContract.methods
    ._publicPrice()
    .call()
    .then((receipt) => {
      console.log("Public price is: " + receipt);
      price = receipt;
      callback && callback(price);
      return price;
    });
  callback && callback(price);
  return price;
}
async function getTotalSupply(callback) {
  let supply = 0;
  await blockchain.myContract.methods
    .totalSupply()
    .call()
    .then((receipt) => {
      console.log("Supply is: " + receipt);
      supply = receipt;
      callback && callback(supply);
      return supply;
    });
  callback && callback(supply);
  return supply;
}
//series page - range
$('.rangeInput').on('input', (e) => {
  $('.rangeValue').text(e.currentTarget.value);
});
$('.rangeInput').on('input', (e) => {
  $('.rangePrice').text((Math.round(e.currentTarget.value * 0.01 * 10000) / 10000).toString() + " ETH");
});
*/
