var safemath = artifacts.require("/contracts/safemath.sol");
var zombiefactory = artifacts.require("ZombieFactory");
var zombiefeeding = artifacts.require("ZombieFeeding");
var zombiehelper = artifacts.require("ZombieHelper");
var zombieattack = artifacts.require("ZombieAttack");
var zombieownership = artifacts.require("ZombieOwnership");

module.exports = function (deployer) {
	deployer.deploy(safemath);
	deployer.deploy(zombiefactory);
	deployer.deploy(zombiefeeding);
	deployer.deploy(zombiehelper);
	deployer.deploy(zombieattack);
	deployer.deploy(zombieownership);
}