const DecentraAid = artifacts.require("DecentraAid");
module.exports = async function (deployer) {
    // Set the owner address
    // const accounts = await web3.eth.getAccounts();
    // const ownerAddress = accounts[0]; // owner is the deployer
    await deployer.deploy(DecentraAid);
}; 
