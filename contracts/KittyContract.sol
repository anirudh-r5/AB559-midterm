pragma solidity ^0.4.25;

import "./ZombieFeeding.sol";

contract KittyContract is ZombieFeeding {
    struct Kitty {
        uint256 genes;
        uint64 birthTime;
    }

    Kitty[] public kitties;
    mapping(uint256 => address) public kittyToOwner;
    mapping(address => uint256) public ownerKittyCount;

    event KittyCreated(
        uint256 indexed kittyId,
        uint256 genes,
        address indexed owner
    );

    // Create a new kitty with specified genes
    function createKitty(string _str) public {
        uint genes = uint(keccak256(abi.encodePacked(_str))) % (10 ** 16);
        uint256 kittyId = kitties.length;
        kitties.push(Kitty(genes, uint64(now)));
        kittyToOwner[kittyId] = msg.sender;
        ownerKittyCount[msg.sender]++;

        emit KittyCreated(kittyId, genes, msg.sender);
    }

    // Get details of a kitty by its ID
    function getKitty(
        uint256 _id
    )
        external
        view
        returns (
            bool isGestating,
            bool isReady,
            uint256 cooldownIndex,
            uint256 nextActionAt,
            uint256 siringWithId,
            uint256 birthTime,
            uint256 matronId,
            uint256 sireId,
            uint256 generation,
            uint256 genes
        )
    {
        require(_id < kitties.length, "Kitty ID does not exist.");

        Kitty storage kitty = kitties[_id];
        return (
            false, // isGestating: not used in this contract
            true, // isReady: always true in this contract
            0, // cooldownIndex: no cooldown implemented
            0, // nextActionAt: no cooldown
            0, // siringWithId: not used
            kitty.birthTime, // birthTime: stored in Kitty struct
            0, // matronId: not used
            0, // sireId: not used
            0, // generation: not used
            kitty.genes // genes: stored in Kitty struct
        );
    }

    // Get total number of kitties created
    function getTotalKitties() public view returns (uint256) {
        return kitties.length;
    }

    // Get kitties owned by a specific address
    function getKittiesByOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](ownerKittyCount[_owner]);
        uint256 counter = 0;

        for (uint256 i = 0; i < kitties.length; i++) {
            if (kittyToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
}
