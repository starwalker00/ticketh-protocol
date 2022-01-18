//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TicketOffice1 is ERC721, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /// @notice Admin tasks :
    /// - buy ticket without depositing ether (paying)
    /// - change _ticketPrice
    /// - change _transferDeadline
    bytes32 public constant ROLE_ADMIN = keccak256("ROLE_ADMIN");

    /// @notice Price of a ticket
    uint256 public _ticketPrice;
    /// @notice Transferring ticket after this date is restricted to admin.
    uint256 public _transferDeadline;
    /// @notice Emitted when _transferDeadline is set.
    event transferDeadlineChanged(
        uint256 indexed new_transferDeadline,
        uint256 indexed old_transferDeadline,
        address changerAddress
    );
    /// @notice Emitted when _ticketPrice is set.
    event ticketPriceChanged(
        uint256 indexed new_ticketPrice,
        uint256 indexed old_ticketPrice,
        address changerAddress
    );

    /// @notice Returns _transferDeadline.
    function get_transferDeadline() public view returns (uint256) {
        return _transferDeadline;
    }

    /// @notice Returns _ticketPrice.
    function get_ticketPrice() public view returns (uint256) {
        return _ticketPrice;
    }

    /// @notice Sets _ticketPrice.
    /// @notice Callable only by high roles
    function set_ticketPrice(uint256 ticketPrice) public {
        uint256 old_ticketPrice = _ticketPrice;
        _ticketPrice = ticketPrice;
        emit ticketPriceChanged(_ticketPrice, old_ticketPrice, msg.sender);
    }

    /// @notice Sets _transferDeadline.
    /// @notice Callable only by high roles
    function set_transferDeadline(uint256 transferDeadline) public {
        require(hasRole(ROLE_ADMIN, msg.sender), "ROLE_ADMIN needed.");
        uint256 old_transferDeadline = _transferDeadline;
        _transferDeadline = transferDeadline;
        emit transferDeadlineChanged(
            _transferDeadline,
            old_transferDeadline,
            msg.sender
        );
    }

    constructor(uint256 ticketPrice, uint256 transferDeadline)
        payable
        ERC721("TicketOffice1", "TO1")
    {
        _grantRole(ROLE_ADMIN, msg.sender);
        set_ticketPrice(ticketPrice);
        set_transferDeadline(transferDeadline);
        buyTicket(true);
    }

    /// @notice Function to transfer Ether from this contract to address from input.
    /// @param reserved Bypass the payment when buying, msg.sender needs ROLE_ADMIN.
    function buyTicket(bool reserved) public payable returns (uint256) {
        deposit(reserved);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        return newItemId;
    }

    /// @notice Function to transfer Ether from this contract to address from input.
    /// Callable only by high roles
    function transfer(address payable to, uint256 amount) public {
        (bool success, ) = to.call{value: amount}("");
        require(success, "Failed to send Ether.");
    }

    /// @notice Function to deposit Ether into this contract.
    /// @param reserved Bypass the payment when buying.
    function deposit(bool reserved) public payable {
        if (reserved) {
            require(hasRole(ROLE_ADMIN, msg.sender), "ROLE_ADMIN needed.");
        } else {
            require(msg.value >= _ticketPrice, "Not enough money sent.");
        }
    }

    /// @notice https://forum.openzeppelin.com/t/derived-contract-must-override-function-supportsinterface/6315/2
    /// @notice override supportsInterface from ERC721 and AccessControl
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
