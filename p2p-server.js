const WebSocket = require('ws');

const PEERS = process.env.PEERS 
			  ? process.env.PEERS.split(',') 
			  : [];

class P2PServer {
	constructor(blockchain){
		this.sockets = [];
		this.blockchain = blockchain;
	}

	listen(port) {
		const server = new WebSocket.Server({port});
		
		server.on('connection', socket => this.connect(socket));

		this.connectAll();
	}

	connect(socket){
		this.sockets.push(socket);
		
		this.update(socket);
		this.notify(socket);
	}

	update(socket){
		socket.on('message', message => {
			const data = JSON.parse(message);
			
			this.blockchain.replace(data);
		});
	}

	notify(socket){
		socket.send(JSON.stringify(this.blockchain.getChain()));
	}

	notifyAll(){
		this.sockets.forEach(socket => this.notify(socket));
	}

	connectAll(){
		PEERS.forEach(peer => {
			const socket = new WebSocket(peer);

			socket.on('open', () => this.connect(socket));
		});	
	}
}

module.exports = P2PServer;
