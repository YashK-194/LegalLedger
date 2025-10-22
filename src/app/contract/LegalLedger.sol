// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LegalLedger is ERC721Enumerable, Ownable {

    constructor() ERC721("TESTLedger NFT", "TLNFT") Ownable(msg.sender) {}

    uint256 private _nextCount = 1;

    struct DocumentMetadata {
        string tokenURI;      // IPFS metadata link
        address minter;      // Who minted this document
        uint256 timestamp;   // When document was minted
        bool isLocked;       // If locked, cannot change URI
    }

    mapping(uint256 => DocumentMetadata) public documents;

    // Prevent accidental ID collisions
    mapping(uint256 => bool) private _usedIds;

    event DocumentMinted(
        uint256 indexed tokenId,
        address indexed minter,
        string tokenURI,
        uint256 timestamp
    );

    event DocumentLocked(uint256 indexed tokenId, uint256 timestamp);

    // Token ID generator
    function generateTokenId() internal returns (uint256) {
        uint id = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, _nextCount))) % 1_000_000;
        _nextCount++;
        return id;
    }


    // Minting document NFT
    function mintNFT(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = generateTokenId();
        require(bytes(uri).length > 0, "Empty URI");
        _safeMint(to, tokenId);

        documents[tokenId] = DocumentMetadata({
            tokenURI: uri,
            minter: msg.sender,
            timestamp: block.timestamp,
            isLocked: false
        });

        emit DocumentMinted(tokenId, msg.sender, uri, block.timestamp);
        return tokenId;
    }

    // Override to return stored IPFS URI
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return documents[tokenId].tokenURI;
    }

    // Lock metadata forever
    function lockDocument(uint256 tokenId) public onlyOwner {
        require(_usedIds[tokenId], "Token does not exist");
        documents[tokenId].isLocked = true;
        emit DocumentLocked(tokenId, block.timestamp);
    }

    // Update metadata only if not locked
    function updateDocumentURI(uint256 tokenId, string memory newURI) public onlyOwner {
        require(_usedIds[tokenId], "Token does not exist");
        require(bytes(newURI).length > 0, "Empty URI");
        require(!documents[tokenId].isLocked, "Document is locked");
        documents[tokenId].tokenURI = newURI;
    }
}
