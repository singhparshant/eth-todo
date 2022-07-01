require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const endpointUrl =
  "https://rinkeby.infura.io/v3/a1f9734c9fa04396a5c4b10ba55c380d";
const privateKey = process.env.PRIVATE_KEY;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          //private keys array
          [privateKey],
          //url to ethereum node
          endpointUrl
        );
      },
      gas: 4000000,
      gasPrice: 5000000,
      network_id: 4,
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0",
    },
  },
};
