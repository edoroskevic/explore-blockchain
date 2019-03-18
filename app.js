const express = require('express');
const parser = require('body-parser');

const P2PServer = require('./p2p-server');
const Blockchain = require('./blockchain');

const blockchain = new Blockchain();

const webServer = express();
const p2pServer = new P2PServer(blockchain);

const P2P_PORT = process.env.P2P_PORT || 5001;
const HTTP_PORT = process.env.HTTP_PORT || 3001;

blockchain.init();
webServer.use(parser.json());

webServer.get('/', (request, response) => {
	response.json(blockchain.getChain());
});

webServer.post('/add', (request, response) => {
	const data = request.body.data;

	blockchain.add(data);

	
	p2pServer.notifyAll();

	response.redirect('/');
});

p2pServer.listen(P2P_PORT);
console.log(`wooho! p2p-server is on. listening on port ${P2P_PORT}`);

webServer.listen(HTTP_PORT);
console.log(`wooho! http-server is on. listening on port ${HTTP_PORT}`);
