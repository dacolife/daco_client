var ERC223StandardToken = artifacts.require("./ERC223StandardToken");


module.exports = function(deployer,network, accounts) {

    deployer.deploy(ERC223StandardToken,"Lucifier Coin", "LUC",0, accounts[0], 1000 );

};
