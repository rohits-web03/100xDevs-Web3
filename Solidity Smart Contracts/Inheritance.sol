// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Inheritance {
    address public owner;
    address payable recipient;
    uint startTime;
    uint tenYrs;
    uint public lastSeen;

    constructor(address payable  _recipient) {
        owner=msg.sender;
        startTime=block.timestamp;
        lastSeen=block.timestamp;
        tenYrs=10*365 days;
        recipient=_recipient;
    }

    modifier onlyOwner() {
        require(msg.sender==owner);
        _;
    }

    modifier onlyRecipient() {
        require(msg.sender==recipient);
        _;
    }

    function ping() public onlyOwner {
        lastSeen=block.timestamp;
    }

    function deposit() public payable onlyOwner {
        ping();
    }

    function claim() external onlyRecipient {
        require(lastSeen<block.timestamp-tenYrs,"Not the right time");
        require(address(this).balance>0,"Current Balance is 0");
        payable(recipient).transfer(address(this).balance);
    }
}
