// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract VerificationRegistry {
    struct VerificationRecord {
        uint256 tokenId;
        address minter;
        address mintedTo;
        uint256 timestamp;
        string ipfsCid;
        bool exists;
    }

    mapping(uint256 => VerificationRecord) private records;

    event VerificationRegistered(
        uint256 indexed tokenId,
        address indexed minter,
        address indexed mintedTo,
        uint256 timestamp,
        string ipfsCid
    );

    function registerVerification(
        uint256 tokenId,
        address minter,
        address mintedTo,
        uint256 timestamp,
        string memory ipfsCid
    ) external {
        require(!records[tokenId].exists, "Record already exists");
        require(bytes(ipfsCid).length > 0, "Invalid IPFS hash");

        records[tokenId] = VerificationRecord({
            tokenId: tokenId,
            minter: minter,
            mintedTo: mintedTo,
            timestamp: timestamp,
            ipfsCid: ipfsCid,
            exists: true
        });

        emit VerificationRegistered(
            tokenId,
            minter,
            mintedTo,
            timestamp,
            ipfsCid
        );
    }

    function getVerificationRecord(
        uint256 tokenId
    ) public view returns (uint256, address, address, uint256, string memory) {
        VerificationRecord memory record = records[tokenId];
        require(record.exists, "No record found");
        return (
            record.tokenId,
            record.minter,
            record.mintedTo,
            record.timestamp,
            record.ipfsCid
        );
    }

    function recordExists(uint256 tokenId) public view returns (bool) {
        return records[tokenId].exists;
    }
}
