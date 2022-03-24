const hre = require("hardhat");

async function main() {

      const Wave = await hre.ethers.getContractFactory("Wave");
      const wave = await Wave.deploy(/*{value: hre.ethers.utils.parseEther("5")}*/);

      await wave.deployed();
      console.log("Wave Address: ", wave.address);
      //console.log("Contract Balance: ", hre.ethers.utils.formatEther(await hre.ethers.provider.getBalance(wave.address)));
}

main().then(() => process.exit(0))
.catch ((error) => {
      console.log(error);
      process.exit(1);
})