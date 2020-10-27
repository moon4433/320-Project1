
const Server = require("./server.js").Server;
const PacketBuilder = require("./packet-builder.js").PacketBuilder;

const Game = {
	whoseTurn:1,
	whoHasWon:0,
	board:[ 
		[1,2,0,0,1,1,0,1],
		[2,2,2,2,0,2,2,0],
		[0,2,0,0,0,1,0,1],
		[1,0,2,0,2,0,1,0],
		[0,2,0,1,0,1,0,1],
		[2,0,2,0,2,0,1,0],
		[0,2,2,0,2,1,2,1],
		[1,0,2,1,0,0,1,1]	
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
		if(this.whoseTurn == 2 && client == this.clientRed){
			
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
		let checkSpot = this.checkIfSpotTaken(x,y,kinged);

//--------------------------------------------------------------------------------------- Black un-Kinged

		if(checkSpot == 1){

			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
	
			
		}
		if(checkSpot == 2){
			
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
	
			
		}
		if(checkSpot == 3){
			
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
	
			
		}
		if(checkSpot == 4){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
			
		}
		if(checkSpot == 5){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			
		}
		if(checkSpot == 6){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
			
		}
		if(checkSpot == 7){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			
		}
		if(checkSpot == 8){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			
		}

//--------------------------------------------------------------------------------------- Red un-Kinged
		
		if(checkSpot == 9){

			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
	
			
		}
		if(checkSpot == 10){
			
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
	
			
		}
		if(checkSpot == 11){
			
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
	
			
		}
		if(checkSpot == 12){
		
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
			
		}
		if(checkSpot == 13){
		
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 14){
		
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
			
		}
		if(checkSpot == 15){
		
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 16){
		
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}

//--------------------------------------------------------------------------------------- Black Kinged

		if(checkSpot == 17){ // diagonal checks
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 18){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 19){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 20){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 21){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
			
		}
		if(checkSpot == 22){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
			
		}
		if(checkSpot == 23){ // top left board corner
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 24){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
			
		}
		if(checkSpot == 25){ // top right board corner
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 26){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 27){ // bottom right board corner
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 28){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 29){ // bottom left board corner
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 30){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 31){ // left board edge
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 32){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
			
		}
		if(checkSpot == 33){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 34){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
			
		}
		if(checkSpot == 35){ // right board edge
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 36){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 37){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 38){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 39){ // top board edge
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 40){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
			
		}
		if(checkSpot == 41){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 42){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
			
		}
		if(checkSpot == 43){ // bottom board edge
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 44){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 45){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 46){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}

//--------------------------------------------------------------------------------------- Red Kinged

		if(checkSpot == 47){ // diagonal checks
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 48){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 49){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 50){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 51){
	
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
			
		}
		if(checkSpot == 52){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
			
		}
		if(checkSpot == 53){ // top left board corner
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 54){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
			
		}
		if(checkSpot == 55){ // top right board corner
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 56){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 57){ // bottom right board corner
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 58){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 59){ // bottom left board corner
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 60){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 61){ // left board edge
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 62){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
			
		}
		if(checkSpot == 63){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 64){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
			
		}
		if(checkSpot == 65){ // right board edge
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 66){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 67){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 68){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 69){ // top board edge
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 70){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
			
		}
		if(checkSpot == 71){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Empty");
			
		}
		if(checkSpot == 72){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " Taken");
			
		}
		if(checkSpot == 73){ // bottom board edge
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 74){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 75){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Empty");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}
		if(checkSpot == 76){
		
			console.log("Y - 1:" + (y - 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y - 1:" + (y - 1) + " X + 1: " + (x + 1) + " null");
			console.log("Y + 1:" + (y + 1) + " X - 1: " + (x - 1) + " Taken");
			console.log("Y + 1:" + (y + 1) + " X + 1: " + (x + 1) + " null");
			
		}

	},
	checkTopLeft(x, y, k){
		let isTLSpotTake = 0;

		if((x - 1) == -1 || (y - 1) == -1){
			isTLSpotTake = 1;
		}
		else if(this.board[y - 1][x - 1] == 0){
			isTLSpotTake = 2;
		}
		else if(this.board[y - 1][x - 1] == 1){
			isTLSpotTake = 3;
		}
		else if(this.board[y - 1][x - 1] == 2){
			isTLSpotTake = 4;
		}
	},
	checkTopRight(x, y, k){
		let isTRSpotTake = 0;

		if((x - 1) == -1 || (y + 1) == 8){
			isTLSpotTake = 1;
		}
		else if(this.board[y + 1][x - 1] == 0){
			isTLSpotTake = 2;
		}
		else if(this.board[y + 1][x - 1] == 1){
			isTLSpotTake = 3;
		}
		else if(this.board[y + 1][x - 1] == 2){
			isTLSpotTake = 4;
		}
	},
	checkBottomLeft(x, y, k){
		let isBLSpotTake = 0;

		if((x + 1) == 8 || (y - 1) == -1){
			isTLSpotTake = 1;
		}
		else if(this.board[y - 1][x + 1] == 0){
			isTLSpotTake = 2;
		}
		else if(this.board[y - 1][x + 1] == 1){
			isTLSpotTake = 3;
		}
		else if(this.board[y - 1][x + 1] == 2){
			isTLSpotTake = 4;
		}
	},
	checkBottomRight(x, y, k){
		let isBRSpotTake = 0;

		if((x - 1) == -1 || (y + 1) == 8){
			isTLSpotTake = 1;
		}
		else if(this.board[y + 1][x - 1] == 0){
			isTLSpotTake = 2;
		}
		else if(this.board[y + 1][x - 1] == 1){
			isTLSpotTake = 3;
		}
		else if(this.board[y + 1][x - 1] == 2){
			isTLSpotTake = 4;
		}
	},
	}
	checkIfSpotTaken(x, y, k){

		let isSpotTake = 0;

		if(this.whoseTurn == 1){ // player 1
			if(k == 1){

				// board corner checks

				if((y-1) == -1 && (x-1) == -1 && this.board[y + 1][x + 1] == 0){ // top left corner
					return isSpotTake = 23;
				}
				else if((y-1) == -1 && (x-1) == -1 && this.board[y + 1][x + 1] == 2){
					return isSpotTake = 24;
				}
				else if((y+1) == 8 && (x-1) == -1 && this.board[y - 1][x + 1] == 0){ // top right corner
					return isSpotTake = 25;
				}
				else if((y+1) == 8 && (x-1) == -1 && this.board[y - 1][x + 1] == 2){
					return isSpotTake = 26;
				}
				else if((y+1) == 8 && (x+1) == 8 && this.board[y - 1][x - 1] == 0){ // bottom Right corner
					return isSpotTake = 27;
				}
				else if((y+1) == 8 && (x+1) == 8 && this.board[y - 1][x - 1] == 2){
					return isSpotTake = 28;
				}
				else if((y-1) == -1 && (x+1) == 8 && this.board[y + 1][x - 1] == 0){ // bottom left corner
					return isSpotTake = 29;
				}
				else if((y-1) == -1 && (x+1) == 8 && this.board[y + 1][x - 1] == 2){
					return isSpotTake = 30;
				}
				
				// board edges

				else if((y-1) == -1 && this.board[y + 1][x + 1] == 0 && this.board[y + 1][x - 1] == 0){ // left edge
					return isSpotTake = 31;
				}
				else if((y-1) == -1 && this.board[y + 1][x + 1] == 2 && this.board[y + 1][x - 1] == 0){ 
					return isSpotTake = 32;
				}
				else if((y-1) == -1 && this.board[y + 1][x + 1] == 0 && this.board[y + 1][x - 1] == 2){ 
					return isSpotTake = 33;
				}
				else if((y-1) == -1 && this.board[y + 1][x + 1] == 2 && this.board[y + 1][x - 1] == 2){ 
					return isSpotTake = 34;
				}

				else if((y+1) == 8 && this.board[y - 1][x + 1] == 0 && this.board[y - 1][x - 1] == 0){ // right edge
					return isSpotTake = 35;
				}
				else if((y+1) == 8 && this.board[y - 1][x + 1] == 2 && this.board[y - 1][x - 1] == 0){ 
					return isSpotTake = 36;
				}
				else if((y+1) == 8 && this.board[y - 1][x + 1] == 0 && this.board[y - 1][x - 1] == 2){ 
					return isSpotTake = 37;
				}
				else if((y+1) == 8 && this.board[y - 1][x + 1] == 2 && this.board[y - 1][x - 1] == 2){ 
					return isSpotTake = 38;
				}

				else if((x-1) == -1 && this.board[y + 1][x + 1] == 0 && this.board[y - 1][x + 1] == 0){ // top edge
					return isSpotTake = 39;
				}
				else if((x-1) == -1 && this.board[y + 1][x + 1] == 2 && this.board[y - 1][x + 1] == 0){ 
					return isSpotTake = 40;
				}
				else if((x-1) == -1 && this.board[y + 1][x + 1] == 0 && this.board[y - 1][x + 1] == 2){ 
					return isSpotTake = 41;
				}
				else if((x-1) == -1 && this.board[y + 1][x + 1] == 2 && this.board[y - 1][x + 1] == 2){ 
					return isSpotTake = 42;
				}

				else if((x+1) == 8 && this.board[y + 1][x - 1] == 0 && this.board[y - 1][x - 1] == 0){ // bottom edge
					return isSpotTake = 43;
				}
				else if((x+1) == 8 && this.board[y + 1][x - 1] == 2 && this.board[y - 1][x - 1] == 0){ 
					return isSpotTake = 44;
				}
				else if((x+1) == 8 && this.board[y + 1][x - 1] == 0 && this.board[y - 1][x - 1] == 2){ 
					return isSpotTake = 45;
				}
				else if((x+1) == 8 && this.board[y + 1][x - 1] == 2 && this.board[y - 1][x - 1] == 2){ 
					return isSpotTake = 46;
				}


				// normal diagonal checks

				else if(this.board[y - 1][x - 1] == 0 && this.board[y + 1][x - 1] == 0 && this.board[y - 1][x + 1] == 0 && this.board[y + 1][x + 1] == 0){
					return isSpotTake = 17;
				}
				else if(this.board[y - 1][x - 1] == 2 && this.board[y + 1][x - 1] == 0 && this.board[y - 1][x + 1] == 0 && this.board[y + 1][x + 1] == 0){
					return isSpotTake = 18;
				}
				else if(this.board[y - 1][x - 1] == 0 && this.board[y + 1][x - 1] == 2 && this.board[y - 1][x + 1] == 0 && this.board[y + 1][x + 1] == 0){
					return isSpotTake = 19;
				}
				else if(this.board[y - 1][x - 1] == 0 && this.board[y + 1][x - 1] == 0 && this.board[y - 1][x + 1] == 2 && this.board[y + 1][x + 1] == 0){
					return isSpotTake = 20;
				}
				else if(this.board[y - 1][x - 1] == 0 && this.board[y + 1][x - 1] == 0 && this.board[y - 1][x + 1] == 0 && this.board[y + 1][x + 1] == 2){
					return isSpotTake = 21;
				}
				else if(this.board[y - 1][x - 1] == 2 && this.board[y + 1][x - 1] == 2 && this.board[y - 1][x + 1] == 2 && this.board[y + 1][x + 1] == 2){
					return isSpotTake = 22;
				}

				// forgotten diagonal checks



			}
			else{

				if((y-1) == -1 && this.board[y + 1][x - 1] == 0){
					return isSpotTake = 5;
				}
				else if((y-1) == -1 && this.board[y + 1][x - 1] == 2){
					return isSpotTake = 6;
				}
				else if(this.board[y - 1][x - 1] == 0 && y+1 == 8){
					return isSpotTake = 7;
				}
				else if(this.board[y - 1][x - 1] == 2 && y+1 == 8){
					return isSpotTake = 8;
				}

				else if(this.board[y - 1][x - 1] == 0 && this.board[y + 1][x - 1] == 0){
					return isSpotTake = 1;
				}
				else if(this.board[y - 1][x - 1] == 2 && this.board[y + 1][x - 1] == 0){
					return isSpotTake = 2;
				}
				else if(this.board[y - 1][x - 1] == 0 && this.board[y + 1][x - 1] == 2){
					return isSpotTake = 3;
				}
				else if(this.board[y - 1][x - 1] == 2 && this.board[y + 1][x - 1] == 2){
					return isSpotTake = 4;
				}
			}

		}
		else if(this.whoseTurn == 2){ // player 2
			if(k == 1){

				// board corner checks

				if((y-1) == -1 && (x-1) == -1 && this.board[y + 1][x + 1] == 0){ // top left corner
					return isSpotTake = 53;
				}
				else if((y-1) == -1 && (x-1) == -1 && this.board[y + 1][x + 1] == 1){
					return isSpotTake = 54;
				}
				else if((y+1) == 8 && (x-1) == -1 && this.board[y - 1][x + 1] == 0){ // top right corner
					return isSpotTake = 55;
				}
				else if((y+1) == 8 && (x-1) == -1 && this.board[y - 1][x + 1] == 1){
					return isSpotTake = 56;
				}
				else if((y+1) == 8 && (x+1) == 8 && this.board[y - 1][x - 1] == 0){ // bottom Right corner
					return isSpotTake = 57;
				}
				else if((y+1) == 8 && (x+1) == 8 && this.board[y - 1][x - 1] == 1){
					return isSpotTake = 58;
				}
				else if((y-1) == -1 && (x+1) == 8 && this.board[y + 1][x - 1] == 0){ // bottom left corner
					return isSpotTake = 59;
				}
				else if((y-1) == -1 && (x+1) == 8 && this.board[y + 1][x - 1] == 1){
					return isSpotTake = 60;
				}
				
				// board edges

				else if((y-1) == -1 && this.board[y + 1][x + 1] == 0 && this.board[y + 1][x - 1] == 0){ // left edge
					return isSpotTake = 61;
				}
				else if((y-1) == -1 && this.board[y + 1][x + 1] == 1 && this.board[y + 1][x - 1] == 0){ 
					return isSpotTake = 62;
				}
				else if((y-1) == -1 && this.board[y + 1][x + 1] == 0 && this.board[y + 1][x - 1] == 1){ 
					return isSpotTake = 63;
				}
				else if((y-1) == -1 && this.board[y + 1][x + 1] == 1 && this.board[y + 1][x - 1] == 1){ 
					return isSpotTake = 64;
				}

				else if((y+1) == 8 && this.board[y - 1][x + 1] == 0 && this.board[y - 1][x - 1] == 0){ // right edge
					return isSpotTake = 65;
				}
				else if((y+1) == 8 && this.board[y - 1][x + 1] == 1 && this.board[y - 1][x - 1] == 0){ 
					return isSpotTake = 66;
				}
				else if((y+1) == 8 && this.board[y - 1][x + 1] == 0 && this.board[y - 1][x - 1] == 1){ 
					return isSpotTake = 67;
				}
				else if((y+1) == 8 && this.board[y - 1][x + 1] == 1 && this.board[y - 1][x - 1] == 1){ 
					return isSpotTake = 68;
				}

				else if((x-1) == -1 && this.board[y + 1][x + 1] == 0 && this.board[y - 1][x + 1] == 0){ // top edge
					return isSpotTake = 69;
				}
				else if((x-1) == -1 && this.board[y + 1][x + 1] == 1 && this.board[y - 1][x + 1] == 0){ 
					return isSpotTake = 70;
				}
				else if((x-1) == -1 && this.board[y + 1][x + 1] == 0 && this.board[y - 1][x + 1] == 1){ 
					return isSpotTake = 71;
				}
				else if((x-1) == -1 && this.board[y + 1][x + 1] == 1 && this.board[y - 1][x + 1] == 1){ 
					return isSpotTake = 72;
				}

				else if((x+1) == 8 && this.board[y + 1][x - 1] == 0 && this.board[y - 1][x - 1] == 0){ // bottom edge
					return isSpotTake = 73;
				}
				else if((x+1) == 8 && this.board[y + 1][x - 1] == 1 && this.board[y - 1][x - 1] == 0){ 
					return isSpotTake = 74;
				}
				else if((x+1) == 8 && this.board[y + 1][x - 1] == 0 && this.board[y - 1][x - 1] == 1){ 
					return isSpotTake = 75;
				}
				else if((x+1) == 8 && this.board[y + 1][x - 1] == 1 && this.board[y - 1][x - 1] == 1){ 
					return isSpotTake = 76;
				}


				// normal diagonal checks

				else if(this.board[y - 1][x - 1] == 0 && this.board[y + 1][x - 1] == 0 && this.board[y - 1][x + 1] == 0 && this.board[y + 1][x + 1] == 0){
					return isSpotTake = 47;
				}
				else if(this.board[y - 1][x - 1] == 1 && this.board[y + 1][x - 1] == 0 && this.board[y - 1][x + 1] == 0 && this.board[y + 1][x + 1] == 0){
					return isSpotTake = 48;
				}
				else if(this.board[y - 1][x - 1] == 0 && this.board[y + 1][x - 1] == 1 && this.board[y - 1][x + 1] == 0 && this.board[y + 1][x + 1] == 0){
					return isSpotTake = 49;
				}
				else if(this.board[y - 1][x - 1] == 0 && this.board[y + 1][x - 1] == 0 && this.board[y - 1][x + 1] == 1 && this.board[y + 1][x + 1] == 0){
					return isSpotTake = 50;
				}
				else if(this.board[y - 1][x - 1] == 0 && this.board[y + 1][x - 1] == 0 && this.board[y - 1][x + 1] == 0 && this.board[y + 1][x + 1] == 1){
					return isSpotTake = 51;
				}
				else if(this.board[y - 1][x - 1] == 1 && this.board[y + 1][x - 1] == 1 && this.board[y - 1][x + 1] == 1 && this.board[y + 1][x + 1] == 1){
					return isSpotTake = 52;
				}

			}
			else{

				if((y-1) == -1 && this.board[y + 1][x + 1] == 0){
					return isSpotTake = 13;
				}
				else if((y-1) == -1 && this.board[y + 1][x + 1] == 1){
					return isSpotTake = 14;
				}
				else if(this.board[y - 1][x + 1] == 0 && y+1 == 8){
					return isSpotTake = 15;
				}
				else if(this.board[y - 1][x + 1] == 1 && y+1 == 8){
					return isSpotTake = 16;
				}

				else if(this.board[y - 1][x + 1] == 0 && this.board[y + 1][x + 1] == 0){
					return isSpotTake = 9;
				}
				else if(this.board[y - 1][x + 1] == 1 && this.board[y + 1][x + 1] == 0){
					return isSpotTake = 10;
				}
				else if(this.board[y - 1][x + 1] == 0 && this.board[y + 1][x + 1] == 1){
					return isSpotTake = 11;
				}
				else if(this.board[y - 1][x + 1] == 1 && this.board[y + 1][x + 1] == 1){
					return isSpotTake = 12;
				}
				
			}
		}			
};

Server.start(Game);
