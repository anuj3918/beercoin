"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = require("./block");
const p2p_1 = require("./p2p");
const validations_1 = require("./validations");
const utils_1 = require("./utils");
const difficulty_1 = require("./difficulty");
const hash_tasks_1 = require("./hash_tasks");
const blockchain_1 = require("./blockchain");
exports.getLatestBlock = blockchain_1.getLatestBlock;
let blockchain = blockchain_1.getBlockchain();
let genesisBlock = blockchain_1.getGenesisBlock();
const generateNextBlock = (blockData) => {
    const previousBlock = blockchain_1.getLatestBlock();
    const difficulty = difficulty_1.getDifficulty(blockchain_1.getBlockchain());
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = utils_1.getCurrentTimestamp();
    const newBlock = findBlock(nextIndex, previousBlock.hash, nextTimestamp, blockData, difficulty);
    addBlockToChain(newBlock);
    p2p_1.broadcastLatest();
    return newBlock;
};
exports.generateNextBlock = generateNextBlock;
const findBlock = (index, previousHash, timestamp, data, difficulty) => {
    let nonce = 0;
    while (true) {
        const hash = hash_tasks_1.calculateHash(index, previousHash, timestamp, data, difficulty, nonce);
        if (hash_tasks_1.hashMatchesDifficulty(hash, difficulty)) {
            return new block_1.Block(index, hash, previousHash, timestamp, data, difficulty, nonce);
        }
        nonce++;
    }
};
exports.findBlock = findBlock;
const addBlockToChain = (newBlock) => {
    if (validations_1.isValidNewBlock(newBlock, blockchain_1.getLatestBlock())) {
        blockchain.push(newBlock);
        return true;
    }
    return false;
};
exports.addBlockToChain = addBlockToChain;
const replaceChain = (newBlocks) => {
    if (validations_1.isValidChain(newBlocks) && newBlocks.length > blockchain_1.getBlockchain().length) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        blockchain = newBlocks;
        p2p_1.broadcastLatest();
    }
    else {
        console.log('Received blockchain invalid');
    }
};
exports.replaceChain = replaceChain;
//# sourceMappingURL=actions.js.map