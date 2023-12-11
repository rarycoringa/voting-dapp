pragma solidity >=0.8.2 <0.9.0;

import { ERC721 } from '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import { Counters } from '@openzeppelin/contracts/utils/Counters.sol';

contract VoteNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _voteIds;
    
    address private _owner;

    event VoteNFTconstructorEvent(address sender, address contractAddress, string message);

    constructor() ERC721("Vote NFT", "VOTE") {
        _owner = msg.sender;
        emit VoteNFTconstructorEvent(msg.sender, address(this), "Vote NFT successfully deployed!");
    }

    event OnlyAllowedOperatorEvent(address operator, address owner, string message);

    modifier onlyAllowedOperator(address _operator) {
        require(_operator == _owner, "Operator is not allowed.");
        if (_operator == _owner) {
            emit OnlyAllowedOperatorEvent(
                _operator,
                _owner,
                "Operator allowed."
            );
        } else {
            emit OnlyAllowedOperatorEvent(
                _operator,
                _owner,
                "Operator not allowed."
            );
        }
        _;
    }

    event MintVoteToEvent(address candidate, uint voteId, string message);

    function mintVoteTo(address _candidate) external onlyAllowedOperator(msg.sender) returns (uint) {
        _voteIds.increment();
        uint _voteId = _voteIds.current();
        _safeMint(_candidate, _voteId);

        emit MintVoteToEvent(
                _candidate,
                _voteId,
                "Vote sucessfully minted."
            );

        return _voteId;
    }
}
