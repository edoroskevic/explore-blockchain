const SHA256 = require('crypto-js/sha256');

class Blockchain{
	constructor(){
		this.chain = [];
	}

	init(){
		const data = 'genesis';
		const timestamp = Date.now();
		const link = SHA256('genesis').toString();
		const hash = SHA256(`${timestamp}${link}${data}`).toString();

		const block = {timestamp, link, hash, data};

		this.chain.push(block);
	}

	add(data){
		console.log(data);
		const timestamp = Date.now();
		const link = this.getLastBlock().hash.toString();
		const hash = SHA256(`${timestamp}${link}${data}`).toString();

		const block = {timestamp, link, hash, "data": data};

		this.chain.push(block);
	}

	replace(data){
		this.chain = data;
	}

	getChain(){
		return this.chain;
	}
	
	getChainLength(){
		return this.chain.length;
	}

	getLastBlock(){
		return this.chain[this.getChainLength() - 1];
	}

	print(){
		this.chain.forEach( block => {
			const {hash, link, timestamp, data} = block;

			console.log(`
				Hash: ${hash.substring(0, 10)}\n
				Link: ${link.substring(0, 10)}\n
				Time: ${timestamp}\n
				Data: ${data}\n
				----------------------------
			`);
		});
	}

}

module.exports = Blockchain;
