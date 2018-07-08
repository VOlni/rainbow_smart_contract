var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};

var Rainbow = artifacts.require("./Rainbow.sol");

module.exports = function(deployer) {
  deployer.deploy(Rainbow);
};

var ERC20Interface = artifacts.require("./ERC20Interface.sol");

module.exports = function(deployer) {
  deployer.deploy(ERC20Interface);
};
