// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//Contract address is : 0xc309A60f0ec1aB2074da332515E6867831C92e42
contract Whitelist {

    //Max number of whitelist spots
    uint8 public maxWLaddresses;

    //Number of addresses already whitelisted, by default its 0
    uint8 public addressesinWL;

    //To check whether particular address is whitelisted or not, by default all are false
    mapping (address => bool) public WLaddress;

    constructor(uint8 _maxWLaddresses) {
        maxWLaddresses = _maxWLaddresses;
    }

    function addAddresstoWL() public {
        require(!WLaddress[msg.sender], "This address is already whitelisted!");
        require(addressesinWL <= maxWLaddresses, "No whitelisted spots left!");
        WLaddress[msg.sender] = true;
        addressesinWL++;
    }
}