//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TicketOffice1 is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Transferring ticket after this date is restricted to admin.
    uint256 private _transferDeadline;

    /// @notice Emitted when transferDeadline is set.
    event transferDeadlineChanged(
        uint256 indexed new_transferDeadline,
        uint256 indexed old_transferDeadline,
        address changerAddress
    );

    /// @notice Returns transferDeadline.
    function get_transferDeadline() public view returns (uint256) {
        return _transferDeadline;
    }

    /// @notice Sets transferDeadline.
    function set_transferDeadline(uint256 transferDeadline) public {
        uint256 old_transferDeadline = _transferDeadline;
        _transferDeadline = transferDeadline;
        emit transferDeadlineChanged(
            _transferDeadline,
            old_transferDeadline,
            msg.sender
        );
    }

    constructor(uint256 transferDeadline) ERC721("TicketOffice1", "TO1") {
        set_transferDeadline(transferDeadline);
        buyTicket();
    }

    // function mintFirst() public returns (uint256) {
    //     require(_tokenIds.current() == 0, "First token already minted");
    //     _tokenIds.increment();
    //     uint256 firstItemId = _tokenIds.current();
    //     _mint(msg.sender, firstItemId);
    //     return firstItemId;
    // }

    function buyTicket() public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        return newItemId;
    }
}
