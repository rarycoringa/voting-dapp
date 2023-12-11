pragma solidity >= 0.8.2 < 0.9.0;

import { VoteNFT } from 'contracts/VoteNFT.sol';

interface VotingDAppInterface {
    function registerCandidate(address _candidate) external;

    function getCandidates() external returns (address[] memory);
    
    function registerVoter(address _voter) external;

    function startVotingProcess() external;

    function vote(address _candidate) external returns (uint);

    function getPartialResult() external returns (address[] memory, uint[] memory);

    function finishVotingProcess() external;

    function getFinalResult() external returns (address[] memory, uint[] memory);

    function getCandidateVotesAmount(address) external returns (uint);

}

contract VotingDApp is VotingDAppInterface {

    address private _owner;
    VoteNFT private _VoteNFT;

    address[] private _candidates;
    address[] private _voters;

    mapping(address => uint) private _voteIds;
    mapping(address => bool) private _voterAlreadyVoted;
    
    uint private _startedAt;
    uint private _finishedAt;

    event VotingDAppConstructorEvent(address sender, address contractAddress, string message);

    constructor() {
        _owner = msg.sender;
        _VoteNFT =  new VoteNFT();

        emit VotingDAppConstructorEvent(
            msg.sender,
            address(this),
            "Voting DApp successfully deployed!"
        );
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Sender is not owner.");
        _;
    }

    modifier hasNotStarted() {
        require(_startedAt == 0, "Voting already started.");
        _;
    }

    modifier hasStarted() {
        require(_startedAt != 0, "Voting not started yet.");
        _;
    }

    modifier hasNotFinished() {
        require(_finishedAt == 0, "Voting already finished.");
        _;
    }

    modifier hasFinished() {
        require(_finishedAt != 0, "Voting not finished yet.");
        _;
    }

    modifier isVoter(address _address) {
        require(_addressExistsIn(_address, _voters), "Address is not a voter.");
        _;
    }

    modifier hasNotVoted(address _voter) {
        require(!_voterAlreadyVoted[_voter], "Address already voted.");
        _;
    }

    modifier isCandidate(address _address) {
        require(_addressExistsIn(_address, _candidates), "Address is not a candidate.");
        _;
    }

    function _addressExistsIn(address _address, address[] memory _list) private pure returns (bool) {
        for (uint i = 0; i < _list.length; i++) {
            if (_address == _list[i]) {
                return true;
            }
        }

        return false;
    }

    function registerCandidate(address _candidate) public onlyOwner hasNotStarted {
        _candidates.push(_candidate);
    }

    function getCandidates() public view returns (address[] memory) {
        return _candidates;
    }

    function registerVoter(address _voter) public onlyOwner hasNotStarted {
        _voters.push(_voter);
    }

    function startVotingProcess() public onlyOwner hasNotStarted {
        _startedAt = block.timestamp;
    }

    function vote(address _candidate) public hasStarted hasNotFinished isVoter(msg.sender) hasNotVoted(msg.sender) isCandidate(_candidate) returns (uint) {
        uint _voteId = _VoteNFT.mintVoteTo(_candidate);
        _voteIds[msg.sender] = _voteId;

        _voterAlreadyVoted[msg.sender] = true;

        return _voteId;
    }

    function _getResult() private view hasStarted returns (address[] memory, uint[] memory) {
        uint[] memory _votesAmounts = new uint[](_candidates.length);

        for (uint i = 0; i < _candidates.length; i++) {
            _votesAmounts[i] = _VoteNFT.balanceOf(_candidates[i]);
        }

        return (_candidates, _votesAmounts);
    }

    function getPartialResult() public view hasStarted hasNotFinished returns (address[] memory, uint[] memory) {
        
        (address[] memory candidates_, uint[] memory _votesAmount) = _getResult();

        return (candidates_, _votesAmount);
    }

    function finishVotingProcess() public onlyOwner hasStarted hasNotFinished {
        _finishedAt = block.timestamp;
    }

    function getFinalResult() public view hasFinished returns (address[] memory, uint[] memory) {
        
        (address[] memory candidates_, uint[] memory _votesAmount) = _getResult();

        return (candidates_, _votesAmount);
    }

    function getCandidateVotesAmount(address _candidate) public view returns (uint) {
        uint _votesAmount = _VoteNFT.balanceOf(_candidate);

        return _votesAmount;
    }
}