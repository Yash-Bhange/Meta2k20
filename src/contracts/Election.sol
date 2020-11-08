// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
//pragma experimental ABIEncoderV2;

contract Election {

    uint [8]contestants;
    bool public status;
    address public organiser;
    mapping(address=>uint)public voters;
    uint electionCount =0;
    
    constructor() public{
        organiser = msg.sender;
        status = false;
        contestants[0]=0;
        contestants[1]=0;
        contestants[2]=0;
        contestants[3]=0;
        contestants[4]=0;
        contestants[5]=0;
        contestants[6]=0;
        contestants[7]=0;

        
    }


    function startVoting() public {
        
        require(msg.sender==organiser);
        status = true;
        electionCount++;
        contestants[0]=0;
        contestants[1]=0;
        contestants[2]=0;
        contestants[3]=0;
        contestants[4]=0;
        contestants[5]=0;
        contestants[6]=0;
        contestants[7]=0;
    }
    function endVoting() public{
        require(msg.sender == organiser);
        status = false;
    }


    function vote(uint index) public{
        require(status == true);
        require(voters[msg.sender]<electionCount);
        voters[msg.sender]=electionCount;
        contestants[index]++;
    }
    function check() public returns(bool){
        if(voters[msg.sender]<electionCount)
            return true;
        else
            return false;

    }
   
    function getResult() public view returns(uint[] memory){
        require(msg.sender == organiser);

         uint[] memory result=new uint[](8);

         for(uint i=0;i<8;i++){
           
           result[i]=contestants[i];
         }
        return result;
    }
}