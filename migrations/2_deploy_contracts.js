var safemath = artifacts.require("SafeMath.sol");
var zombiefactory = artifacts.require("ZombieFactory.sol");
var zombiefeeding = artifacts.require("ZombieFeeding.sol");
var zombiehelper = artifacts.require("ZombieHelper.sol");
var zombieattack = artifacts.require("ZombieAttack.sol");
var zombieownership = artifacts.require("ZombieOwnership.sol");

module.exports = function (deployer) {
	deployer.deploy(safemath);
	deployer.deploy(zombiefactory);
	deployer.deploy(zombiefeeding);
	deployer.deploy(zombiehelper);
	deployer.deploy(zombieattack);
	deployer.deploy(zombieownership);
}