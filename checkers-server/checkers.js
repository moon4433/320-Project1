
const Server = require("./server.js").Server;
const PacketBuilder = require("./packet-builder.js").PacketBuilder;

const Game = {
	whoseTurn:1,
	whoHasWon:0,
	board:[ 
		[0,2,0,0,0,1,0,1],
		[2,0,2,0,0,0,1,0],
		[0,2,0,0,0,1,0,1],
		[2,0,2,0,2,0,1,0],
		[0,2,0,0,0,1,0,1],
		[2,0,2,0,0,0,1,0],
		[0,2,0,0,0,1,0,1],
		[2,0,2,0,0,0,1,0]	
	],

	clientBlack:null, // player 1
	clientRed:null, // player 2

	playMove(client, x, y){

		

		//if(this.board[y][x] > 0) return; // ignore MOVEs on taken spaces

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
	checkMove(client, x, y, isKinged){
		
		// ignore MOVEs after game has ended:
		if(this.whoHasWon > 0) return;
		
		// ignore everyone but clientBlack on clientBlack's turn:
		if(this.whoseTurn == 1 && client != this.clientBlack) return;
		
		// ignore everyone but clientRed on clientRed's turn:
		if(this.whoseTurn == 2 && client != this.clientRed) return;
		
		if(x < 0) return; // ignore MOVEs off the board
		
		if(y < 0) return; // ignore MOVEs off the board
		
		if(y >= this.board.length) return; // ignore MOVEs off the board
		
		if(x >= this.board[y].length) return; // ignore MOVEs off the board
		
		if(this.whoseTurn == 1 && client == this.clientBlack){
			
			if(this.board[y][x] == this.whoseTurn){
				
				this.checkDiagonal(x, y, isKinged);

			}
			else{
				this.moveNotValid();
			}
		}

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
	moveNotValid(){
		const notValidPacket = PacketBuilder.notValid();
		Server.broadcastPacket(notValidPacket);
	},
	checkDiagonal(x, y, kinged){
		// console.log(this.board[y - 1][x - 1]);
		// console.log(this.board[y + 1][x - 1]);
		// console.log(this.board[y - 1][x + 1]);
		// console.log(this.board[y - 1][x + 1]);
		if(this.checkIfSpotTaken(x,y) == 1){

			console.log("Y - 1:" + (y - 1) + "_X - 1: " + (x - 1) + " Taken");
	
			if(kinged == 1){
	
	
	
			}
			else{
	
	
	
			}
		}
		if(this.checkIfSpotTaken(x,y) == 2){
			
			console.log("Y - 1:" + (y - 1) + "_X - 1: " + (x - 1) + " Empty");
	
			if(kinged == 1){
	
	
	
			}
			else{
	
	
	
			}
		}
		if(this.checkIfSpotTaken(x,y) == 3){
			
			console.log("Y + 1:" + (y + 1) + "_X - 1: " + (x - 1) + " Taken");
	
			if(kinged == 1){
	
	
	
			}
			else{
	
	
	
			}
		}
		if(this.checkIfSpotTaken(x,y) == 4){
		
			console.log("Y + 1:" + (y + 1) + "_X - 1: " + (x - 1) + " Empty");
	
			if(kinged == 1){
	
	
	
			}
			else{
	
	
	
			}
		}
	},
	checkIfSpotTaken(x, y){

		let isSpotTake = 0;

		if(this.whoseTurn == 1){

			if(this.board[y - 1][x - 1] == 2){
				return isSpotTake = 1;
			}
			else if(this.board[y - 1][x - 1] == 0){
				return isSpotTake = 2;
			}
			if(this.board[y + 1][x - 1] == 2){
				return isSpotTake = 3;
			}
			if(this.board[y + 1][x - 1] == 0){
				return isSpotTake = 4;
			}
		}
	}
};

Server.start(Game);
