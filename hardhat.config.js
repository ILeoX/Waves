require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'hardhat',
  solidity: '0.8.9',
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ropsten: {
      url: 'https://ropsten.infura.io/v3/74c15d5976c349c8bc4a7014da431c5d',
      accounts: [process.env.PRIVATE_KEY],
    },
    alchemy: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/OJzScSqE4BHCXvMTjFea-C8UyxQ1ePZf',
      accounts: [process.env.PRIVATE_KEY],
    },
  },
}
