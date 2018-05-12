var DACOMain = artifacts.require("./DACOMain");


module.exports = function(deployer,network, accounts) {

  deployer.deploy(DACOMain);

};
