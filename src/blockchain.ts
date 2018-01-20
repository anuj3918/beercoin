import {Block} from './block'

const genesisBlock: Block = new Block(
    0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', null, 1465154705, 'my genesis block!!', 15, 0
);

var blockchain: Block[] = [genesisBlock]

const getBlockchain = () => blockchain

const getGenesisBlock = () => genesisBlock

const getLatestBlock = () => blockchain[blockchain.length - 1]

export {getBlockchain, getLatestBlock, getGenesisBlock}
