
const Client = require("./client.js").Client;
const PacketBuilder = require("./packet-builder.js").PacketBuilder;

exports.Server = {
	port:320,
	clients:[],
	maxConnectedUsers:8,
	start(game){

		this.game = game;

		this.socket = require("net").createServer({}, c=>this.onClientConnect(c));
		this.socket.on("error", e=>this.onError(e));
		this.socket.listen({port:this.port},()=>this.onStartListen());
	},
	onClientConnect(socket){
		console.log("New connectiong from "+socket.localAddress);

		if(this.isServerFull()){ // server full:

			const packet = PacketBuilder.join(9); // REJECTED, server full
			socket.end(packet); // end connection w/ this client (REJECTED):

		}else{ // server NOT full

			// instantiate clients!

			const client = new Client(socket, this);
			this.clients.push(client);

		}



	},
	onClientDisconnect(client){

		// players free up their "seats":
		if (this.game.clientBlack == client) this.game.clientBlack = null;
		if (this.game.clientRed == client) this.game.clientRed = null;

		// TODO: select a spectator to take leaving user's seat?

		const index = this.clients.indexOf(client); // find the object in the array
		if(index >= 0) this.clients.splice(index, 1); // remove the object from the array


	},
	onError(e){
		console.log("Error with listener: " + e);
	},
	onStartListen(){
		console.log("Server is now listening on port "+this.port);
	},
	isServerFull(){
		return (this.clients.length >= this.maxConnectedUsers);
	},
	// this function returns a response ID
	generateResponseID(desiredUsername, client){

				if(desiredUsername.length <= 3) return 4; // username too short
				if(desiredUsername.length > 12) return 5; // username too long

				// letters (uppercase and lowercase)
				// spaces
				// numbers
				const regex1 = /^[a-zA-Z0-9\[\]]+$/; // literal regex in JavaScript
				if(!regex1.test(desiredUsername)) return 6; // uses invalid characters!

				let isUsernameTaken = false;
				this.clients.forEach(c=>{
					if(c == client) return;
					if(c.username == desiredUsername) isUsernameTaken = true;
				});
				if(isUsernameTaken) return 7; // username already taken

				const regex2 = /(fuck|shit|damn|faggot|fag|cunt|ass|asshole|fuckhole|fvck|fuk|5hit)/i;
				if(regex2.test(desiredUsername)) return 8; // username is profain

				//finish with response ids: 1/2/3

				if(this.game.clientBlack == client) return 1; // you are already client B
				if(this.game.clientRed == client) return 2; // you are already client R

				if(!this.game.clientBlack) {
					this.game.clientBlack = client;
					return 1; // you are now client B
				}

				if(!this.game.clientRed) {
					this.game.clientRed = client;
					return 2; // you are now client R
				}

				return 3; // you are a spectator
	},
	broadcastPacket(packet){
		// send a packet to all connected
		this.clients.forEach(c=>{			
			c.sendPacket(packet);			
		});
	},

};
