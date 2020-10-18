
const Server = require("./server.js").Server;
const PacketBuilder = require("./packet-builder.js").PacketBuilder;

const Game = {
	whoseTurn:1,
	whoHasWon:0,
	board:[ 
		[0,2,0,0,0,1,0,1],
		[2,0,2,0,0,0,1,0],
		[0,2,0,0,0,1,0,1],
		[2,0,2,0,0,0,1,0],
		[0,2,0,0,0,1,0,1],
		[2,0,2,0,0,0,1,0],
		[0,2,0,0,0,1,0,1],
		[2,0,2,0,0,0,1,0]	
	],

	clientBlack:null, // player 1
	clientRed:null, // player 2

	playMove(client, x, y){

		// ignore MOVEs after game has ended:
		if(this.whoHasWon > 0) return;
		
		// ignore everyone but clientBlack on clientBlack's turn:
		if(this.whoseTurn == 1 && client != this.clientBlack) return;
		
		// ignore everyone but clientRed on clientRed's turn:
		if(this.whoseTurn == 2 && client != this.clientRed) return;
		
		if(x < 0) return; // ignore MOVEs off the board
		if(y < 0) return; // ignore MOVEs off the board

		if(y >= this.board.length) return; // ignore MOVEs off the boards
		if(x >= this.board[y].length) return; // ignore MOVEs off the boards

		if(this.board[y][x] > 0) return; // ignore MOVEs on taken spaces

		//this.board[y][x] = this.whoseTurn; // sets board state

		this.whoseTurn = (this.whoseTurn == 1) ? 2 : 1; // toggles turn to next player

		this.checkStateAndUpdate();
	},
	checkStateAndUpdate(){

		// TODO: Look for game over


		// send UPDT packet to ALL
		const packet = PacketBuilder.update(this);
		Server.broadcastPacket(packet);
	},
	reset(){
		this.whoseTurn = 1;
        this.whoHasWon = 0;
        this.board = [ 
		[0,2,0,0,0,1,0,1],
		[2,0,2,0,0,0,1,0],
		[0,2,0,0,0,1,0,1],
		[2,0,2,0,0,0,1,0],
		[0,2,0,0,0,1,0,1],
		[2,0,2,0,0,0,1,0],
		[0,2,0,0,0,1,0,1],
		[2,0,2,0,0,0,1,0]	
	];

        this.checkStateAndUpdate();
	},
};

Server.start(Game);
