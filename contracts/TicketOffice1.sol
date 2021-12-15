//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TicketOffice1 is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("TicketOffice1", "TO1") {}

    function mintFirst() public {
        require(_tokenIds.current() == 0, "First token already minted");
        _tokenIds.reset();
        uint256 firstItemId = _tokenIds.current();
        _safeMint(msg.sender, firstItemId);
        _tokenIds.increment();
    }
}
