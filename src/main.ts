import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as WebSocket from 'ws'
import * as url from 'url'

import {Block} from './block'
import {getBlockchain} from './blockchain'
import {generateNextBlock, addBlockToChain} from './actions'
import {initP2PServer, connectToPeers, getSockets} from './p2p'


const httpPort: number = 3001;
const p2pPort: number = 6001;

const initHttpServer = ( myHttpPort: number ) => {
    const app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => {
        res.send(getBlockchain());
    });
    app.post('/mineBlock', (req, res) => {
        const newBlock: Block = generateNextBlock(req.body.data);
        console.log("New block added to blockchain");
        res.send(newBlock);
    });
    app.get('/peers', (req, res) => {
        res.send(getSockets().map(( s: any ) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', (req, res) => {
        connectToPeers(req.body.peer);
        res.send();
    });

    app.listen(myHttpPort, () => {
        console.log('Listening on HTTP port: ' + myHttpPort);
    });
}

initHttpServer(httpPort)
initP2PServer(p2pPort)