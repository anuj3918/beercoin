import {Block} from './block'
import {broadcastLatest} from './p2p';
import {isValidTimestamp, isValidBlockStructure, isValidNewBlock, isValidChain} from './validations'
import {hexToBinary, getCurrentTimestamp} from './utils'
import {getDifficulty, getAdjustedDifficulty} from './difficulty'
import {calculateHash, calculateHashForBlock, hasValidHash, hashMatchesBlockContent, hashMatchesDifficulty} from './hash_tasks'
import {getBlockchain, getLatestBlock, getGenesisBlock} from './blockchain'

let blockchain = getBlockchain()
let genesisBlock = getGenesisBlock()

const generateNextBlock = (blockData: string) => {
    const previousBlock: Block = getLatestBlock();
    const difficulty: number = getDifficulty(getBlockchain())
    const nextIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = getCurrentTimestamp();
    const newBlock: Block = findBlock(nextIndex, previousBlock.hash, nextTimestamp, blockData, difficulty);

    addBlockToChain(newBlock);
    broadcastLatest();    

    return newBlock
};

const findBlock = (index: number, previousHash: string, timestamp: number, data: string, difficulty: number): Block => {
    let nonce = 0;
    while (true) {
        const hash: string = calculateHash(index, previousHash, timestamp, data, difficulty, nonce);
        if (hashMatchesDifficulty(hash, difficulty)) {
            return new Block(index, hash, previousHash, timestamp, data, difficulty, nonce);
        }
        nonce++;
    }
};

const addBlockToChain = (newBlock: Block) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
        return true;
    }
    return false;
};

const replaceChain = (newBlocks: Block[]) => {
    if (isValidChain(newBlocks) && newBlocks.length > getBlockchain().length) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        blockchain = newBlocks;
        broadcastLatest();
    } else {
        console.log('Received blockchain invalid');
    }
};

export {getLatestBlock, generateNextBlock, findBlock, addBlockToChain, replaceChain}