"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash_tasks_1 = require("./hash_tasks");
const utils_1 = require("./utils");
const blockchain_1 = require("./blockchain");
let genesisBlock = blockchain_1.getGenesisBlock();
const isValidTimestamp = (newBlock, previousBlock) => {
    return (previousBlock.timestamp - 60 < newBlock.timestamp)
        && newBlock.timestamp - 60 < utils_1.getCurrentTimestamp();
};
exports.isValidTimestamp = isValidTimestamp;
const isValidNewBlock = (newBlock, previousBlock) => {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    }
    else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return false;
    }
    else if (hash_tasks_1.calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + ' ' + typeof hash_tasks_1.calculateHashForBlock(newBlock));
        console.log('invalid hash: ' + hash_tasks_1.calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
};
exports.isValidNewBlock = isValidNewBlock;
const isValidBlockStructure = (block) => {
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'string';
};
exports.isValidBlockStructure = isValidBlockStructure;
const isValidChain = (blockchainToValidate) => {
    const isValidGenesis = (block) => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if (!isValidGenesis(blockchainToValidate[0])) {
        return false;
    }
    for (let i = 1; i < blockchainToValidate.length; i++) {
        if (!isValidNewBlock(blockchainToValidate[i], blockchainToValidate[i - 1])) {
            return false;
        }
    }
    return true;
};
exports.isValidChain = isValidChain;
//# sourceMappingURL=validations.js.map