import Web3 from "web3";

const CONTRACT_ADDRESS = process.env.NFT_CONTRACT || "";
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const PROVIDER_URL = `https://eth-ropsten.alchemyapi.io/v2/${
  process.env.ALCHEMY_API_KEY || ""
}`;

async function mintNFT() {
  const web3 = new Web3(PROVIDER_URL);
  const contract = require("../artifacts/contracts/NFT.sol/NFT.json");
  const nftContract = new web3.eth.Contract(contract.abi, CONTRACT_ADDRESS);
  const nonce = await web3.eth.getTransactionCount(WALLET_ADDRESS, "latest");
  const tx = {
    from: WALLET_ADDRESS,
    to: CONTRACT_ADDRESS,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mint(WALLET_ADDRESS).encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      const tx = signedTx.rawTransaction;
      if (tx !== undefined) {
        web3.eth.sendSignedTransaction(tx, function (err, hash) {
          if (!err) {
            console.log("The hash of your transaction is: ", hash);
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            );
          }
        });
      }
    })
    .catch((err) => {
      console.log("Promise failed:", err);
    });
}

mintNFT();
