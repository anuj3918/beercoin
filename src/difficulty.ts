import {getBlockchain, getLatestBlock, getGenesisBlock} from './blockchain'
import {Block} from './block'

let blockchain = getBlockchain()
let genesisBlock = getGenesisBlock()

// in seconds
const BLOCK_GENERATION_INTERVAL: number = 10;

// in blocks
const DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10;

const getDifficulty = (aBlockchain: Block[]): number => {
    const latestBlock: Block = aBlockchain[blockchain.length - 1];

    //  if latest block is a multiple of 10 and not a genesis block, we need to check for adjusted difficulty
    if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0) {
        return getAdjustedDifficulty(latestBlock, aBlockchain);
    } else {
        return latestBlock.difficulty;
    }
};

const getAdjustedDifficulty = (latestBlock: Block, aBlockchain: Block[]) => {

    //  find the block on which the difficulty was last time adjusted
    const prevAdjustmentBlock: Block = aBlockchain[blockchain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
    
    //  expected time taken to mine 10 blocks
    const timeExpected: number = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;
    
    //  actual time taken between last time difficulty adjustment and latest block
    const timeTaken: number = latestBlock.timestamp - prevAdjustmentBlock.timestamp;

    if (timeTaken < timeExpected / 2) {
        //  if time taken is less than half of time expected, increase the difficulty
        return prevAdjustmentBlock.difficulty + 1;
    } else if (timeTaken > timeExpected * 2) {
        //  if time taken is more than twice of time expected, decrease the difficulty
        return prevAdjustmentBlock.difficulty - 1;
    } else {
        //  if time taken does not satisfy the above two cases, keep the difficulty as it is
        return prevAdjustmentBlock.difficulty;
    }
};

export {getDifficulty, getAdjustedDifficulty}