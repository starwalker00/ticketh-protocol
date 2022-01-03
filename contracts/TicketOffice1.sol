//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TicketOffice1 is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("TicketOffice1", "TO1") {}

    function mintFirst() public returns (uint256) {
        require(_tokenIds.current() == 0, "First token already minted");
        _tokenIds.increment();
        uint256 firstItemId = _tokenIds.current();
        _mint(msg.sender, firstItemId);
        return firstItemId;
    }

    function buyTicket() public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        return newItemId;
    }
}
