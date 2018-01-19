"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = require("./block");
const genesisBlock = new block_1.Block(0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', null, 1465154705, 'my genesis block!!', 0, 0);
var blockchain = [genesisBlock];
const getBlockchain = () => blockchain;
exports.getBlockchain = getBlockchain;
const getGenesisBlock = () => genesisBlock;
exports.getGenesisBlock = getGenesisBlock;
const getLatestBlock = () => blockchain[blockchain.length - 1];
exports.getLatestBlock = getLatestBlock;
//# sourceMappingURL=blockchain.js.map