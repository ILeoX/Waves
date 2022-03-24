//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Wave is ERC20 {

    constructor() payable ERC20("WAVE", "WAV") {
        _mint(msg.sender, 5000 * 10 ** 18);
    }

    uint private randVal = (block.timestamp + block.difficulty + gasleft())%100;
    uint bounty = ((block.timestamp + block.difficulty) % 5) + 10; //15 tokens max
    string[] bountyWords = ['lack', ' shed', ' ritual', ' fascinate', ' infinite', ' mad', ' tiptoe', ' score', ' appeal', ' explode', 'dismiss', ' energy', ' adult', ' install', ' option', ' glance', 'damage', 'begin', 'deter', ' hope', 'enthusiasm', 'analyst', 'tactic', 'marriage', 'fear', 'girlfriend', 'studio', 'justify', 'ballot', 'ethnic', 'policeman', ' agency', 'live', 'diagram', 'hour', 'illustrate', 'watch', 'attitude', 'proposal', 'decisive', 'indoor', 'beg', 'host', 'academy', ' commission', 'spell', 'slip', 'symptom', 'asylum', 'coach', 'past', 'laborer', 'drum', 'voucher', 'pardon'];

    mapping (address => uint) lastWave;
    
    struct wave{
        string message;
        uint time;
        address waver;
    }

    wave[] internal waves;
    uint private lastBounty = 0;

    address [] internal winners;

    function waveNow(string memory message) external {

        require(block.timestamp - lastWave[msg.sender] >= 15 minutes, "You can only wave every 15 minutes");
        
        if(randVal <= 80) {
            randVal = (block.timestamp + block.difficulty + gasleft())%100;

            _mint(msg.sender, 0.3*10**18);

            emit Transfer(address(this), msg.sender,0.3*10**18);
            console.log("You just won 0.3 WAV tokens!", msg.sender);
        }

        waves.push(wave(message, block.timestamp, msg.sender));
        lastWave[msg.sender] = block.timestamp;
    }

    function getAllWaves () external view returns (wave[] memory){
        return waves;
    }

    function bountyWinner () external {
        require(block.timestamp - lastBounty >= 3 days, "Bounty can only be won every 3 days");
        require(bounty <= 15);
        
        _mint(msg.sender, bounty*10**18);
        
        emit Transfer(address(this), msg.sender, bounty);
        console.log("You won the bounty");
        
        lastBounty = block.timestamp;
        winners.push(msg.sender);
        bounty = ((block.timestamp + block.difficulty) % 5) + 10; //15 tokens max
    }

    
    function getBountyWords () external view returns (string[] memory) {
        return bountyWords;
    }

    function setBountyWords (string[] memory arr) external {
        bountyWords = arr;
    }

    function todayBounty () external view returns (uint) {
        require(bounty <= 500, "Bounty is too high");
        return bounty;
    }

    function retTime () external view returns (uint) {
        return block.timestamp;
    }

    function retLastBounty () external view returns (uint) {
        return lastBounty;
    }

    function returnWinner () external view returns (address[] memory) {
        return winners;
    }
} 

