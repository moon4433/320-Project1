
const Server = require("./server.js").Server;
const PacketBuilder = require("./packet-builder.js").PacketBuilder;

const Game = {
	whoseTurn:1,
	whoHasWon:0,
	board:[ 
		[0,2,0,0,0,1,0,1],
		[2,0,2,0,2,0,1,0],
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
		let tl = this.checkTopLeft(x,y,kinged);
		let tr = this.checkTopRight(x,y,kinged);
		let bl = this.checkBottomLeft(x,y,kinged);
		let br = this.checkBottomRight(x,y,kinged);

		let tlY;
		let tlX;
		let trY;
		let trX;
		let blY;
		let blX;
		let brY;
		let brX;
		

		// check turn
		if(this.whoseTurn == 1){
			if(kinged == 1){

				// check Top Left
				if(tl == 1){
					console.log("Y: " + (y - 1) + "    X: " + (x - 1) + " =  null");
					/* Do Nothing */
				}
				else if(tl == 2){
					console.log("Y: " + (y - 1) + "    X: " + (x - 1) + " =  Empty");
					/* Send TL valid */
					tlY = (y - 1);
					tlX = (x - 1);
				}
				else if(tl == 3){
					console.log("Y: " + (y - 1) + "    X: " + (x - 1) + " =  Yours");
					/* Do Nothing */
				}
				else if(tl == 4){
					console.log("Y: " + (y - 1) + "    X: " + (x - 1) + " =  Taken");
					/* Send TL Valid Jump */
					tlY = (y - 2);
					tlX = (x - 2);
				}

				// check Top Right
				if(tr == 1){
					console.log("Y: " + (y + 1) + "    X: " + (x - 1) + " =  null");
					/* Do Nothing */
				}
				else if(tr == 2){
					console.log("Y: " + (y + 1) + "    X: " + (x - 1) + " =  Empty");
					/* Send TR valid */
					trY = (y + 1);
					trX = (x - 1);
				}
				else if(tr == 3){
					console.log("Y: " + (y + 1) + "    X: " + (x - 1) + " =  Yours");
					/* Do Nothing */
				}
				else if(tr == 4){
					console.log("Y: " + (y + 1) + "    X: " + (x - 1) + " =  Taken");
					/* Send TR Valid jump */
					trY = (y + 2);
					trX = (x - 2);
				}

				// check Bottom Left
				if(bl == 1){
					console.log("Y: " + (y - 1) + "    X: " + (x + 1) + " =  null");
					/* Do Nothing */
				}
				else if(bl == 2){
					console.log("Y: " + (y - 1) + "    X: " + (x + 1) + " =  Empty");
					/* Send BL valid */
					blY = (y - 1);
					blX = (x + 1);
				}
				else if(bl == 3){
					console.log("Y: " + (y - 1) + "    X: " + (x + 1) + " =  Yours");
					/* Do Nothing */
				}
				else if(bl == 4){
					console.log("Y: " + (y - 1) + "    X: " + (x + 1) + " =  Taken");
					/* Send BL valid Jump*/
					blY = (y - 2);
					blX = (x + 2);
				}

				// check Bottom Right
				if(br == 1){
					console.log("Y: " + (y + 1) + "    X: " + (x + 1) + " =  null");
					/* Do Nothing */
				}
				else if(br == 2){
					console.log("Y: " + (y + 1) + "    X: " + (x + 1) + " =  Empty");
					/* Send BR valid */
					brY = (y + 1);
					brX = (x + 1);
				}
				else if(br == 3){
					console.log("Y: " + (y + 1) + "    X: " + (x + 1) + " =  Yours");
					/* Do Nothing */
				}
				else if(br == 4){
					console.log("Y: " + (y + 1) + "    X: " + (x + 1) + " =  Taken");
					/* Send BR valid Jump */
					brY = (y + 2);
					brX = (x + 2);
				}

			}
			else{

				// check Top Left
				if(tl == 1){
					console.log("Y: " + (y - 1) + "    X: " + (x - 1) + " =  null");
					/* Do Nothing */
				}
				else if(tl == 2){
					console.log("Y: " + (y - 1) + "    X: " + (x - 1) + " =  Empty");
					/* Send TL valid */
					tlY = (y - 1);
					tlX = (x - 1);
				}
				else if(tl == 3){
					console.log("Y: " + (y - 1) + "    X: " + (x - 1) + " =  Yours");
					/* Do Nothing */
				}
				else if(tl == 4){
					console.log("Y: " + (y - 1) + "    X: " + (x - 1) + " =  Taken");
					/* Send TL valid Jump */
					tlY = (y - 2);
					tlX = (x - 2);
				}

				// check Top Right
				if(tr == 1){
					console.log("Y: " + (y + 1) + "    X: " + (x - 1) + " =  null");
					/* Do Nothing */
				}
				else if(tr == 2){
					console.log("Y: " + (y + 1) + "    X: " + (x - 1) + " =  Empty");
					/* Send TR valid */
					trY = (y + 1);
					trX = (x - 1);
				}
				else if(tr == 3){
					console.log("Y: " + (y + 1) + "    X: " + (x - 1) + " =  Yours");
					/* Do Nothing */
				}
				else if(tr == 4){
					console.log("Y: " + (y + 1) + "    X: " + (x - 1) + " =  Taken");
					/* Send TR valid Jump */
					trY = (y + 2);
					trX = (x - 2);
				}
			}
		}
		else if(this.whoseTurn == 2){
			if(kinged == 1){

				// check Top Left
				if(tl == 1){
					console.log("Y: " + (y - 1) + "    X: " + (x - 1) + " =  null");
					/* Do Nothing */
				}
				else if(tl == 2){
					console.log("Y: " + (y - 1) + "    X: " + (x - 1) + " =  Empty");
					/* Send TL valid */
					tlY = (y - 1);
					tlX = (x - 1);
				}
				else if(tl == 3){
					console.log("Y: " + (y - 1) + "    X: " + (x - 1) + " =  Yours");
					/* Do Nothing */
				}
				else if(tl == 4){
					console.log("Y: " + (y - 1) + "    X: " + (x - 1) + " =  Taken");
					/* Send TL Valid Jump */
					tlY = (y - 2);
					tlX = (x - 2);
				}

				// check Top Right
				if(tr == 1){
					console.log("Y: " + (y + 1) + "    X: " + (x - 1) + " =  null");
					/* Do Nothing */
				}
				else if(tr == 2){
					console.log("Y: " + (y + 1) + "    X: " + (x - 1) + " =  Empty");
					/* Send TR valid */
					trY = (y + 1);
					trX = (x - 1);
				}
				else if(tr == 3){
					console.log("Y: " + (y + 1) + "    X: " + (x - 1) + " =  Yours");
					/* Do Nothing */
				}
				else if(tr == 4){
					console.log("Y: " + (y + 1) + "    X: " + (x - 1) + " =  Taken");
					/* Send TR Valid jump */
					trY = (y + 2);
					trX = (x - 2);
				}

				// check Bottom Left
				if(bl == 1){
					console.log("Y: " + (y - 1) + "    X: " + (x + 1) + " =  null");
					/* Do Nothing */
				}
				else if(bl == 2){
					console.log("Y: " + (y - 1) + "    X: " + (x + 1) + " =  Empty");
					/* Send BL valid */
					blY = (y - 1);
					blX = (x + 1);
				}
				else if(bl == 3){
					console.log("Y: " + (y - 1) + "    X: " + (x + 1) + " =  Yours");
					/* Do Nothing */
				}
				else if(bl == 4){
					console.log("Y: " + (y - 1) + "    X: " + (x + 1) + " =  Taken");
					/* Send BL valid Jump*/
					blY = (y - 2);
					blX = (x + 2);
				}

				// check Bottom Right
				if(br == 1){
					console.log("Y: " + (y + 1) + "    X: " + (x + 1) + " =  null");
					/* Do Nothing */
				}
				else if(br == 2){
					console.log("Y: " + (y + 1) + "    X: " + (x + 1) + " =  Empty");
					/* Send BR valid */
					brY = (y + 1);
					brX = (x + 1);
				}
				else if(br == 3){
					console.log("Y: " + (y + 1) + "    X: " + (x + 1) + " =  Yours");
					/* Do Nothing */
				}
				else if(br == 4){
					console.log("Y: " + (y + 1) + "    X: " + (x + 1) + " =  Taken");
					/* Send BR valid Jump */
					brY = (y + 2);
					brX = (x + 2);
				}
			}
			else{
				
				// check Bottom Left
				if(bl == 1){
					console.log("Y: " + (y - 1) + "    X: " + (x + 1) + " =  null");
					/* Do Nothing */
				}
				else if(bl == 2){
					console.log("Y: " + (y - 1) + "    X: " + (x + 1) + " =  Empty");
					/* Send BL valid */
					blY = (y - 1);
					blX = (x + 1);
				}
				else if(bl == 3){
					console.log("Y: " + (y - 1) + "    X: " + (x + 1) + " =  Yours");
					/* Do Nothing */
				}
				else if(bl == 4){
					console.log("Y: " + (y - 1) + "    X: " + (x + 1) + " =  Taken");
					/* Send BL valid Jump */
					blY = (y - 2);
					blX = (x + 2);
				}

				// check Bottom Right
				if(br == 1){
					console.log("Y: " + (y + 1) + "    X: " + (x + 1) + " =  null");
					/* Do Nothing */
				}
				else if(br == 2){
					console.log("Y: " + (y + 1) + "    X: " + (x + 1) + " =  Empty");
					/* Send BR valid */
					brY = (y + 1);
					brX = (x + 1);
				}
				else if(br == 3){
					console.log("Y: " + (y + 1) + "    X: " + (x + 1) + " =  Yours");
					/* Do Nothing */
				}
				else if(br == 4){
					console.log("Y: " + (y + 1) + "    X: " + (x + 1) + " =  Taken");
					/* Send BR valid Jump */
					brY = (y + 1);
					brX = (x + 1);
				}
			}
		}

		const sendValidMoves = PacketBuilder.validMoves(tlX, tlY, trX, trY, blX, blY, brX, brY);
		Server.broadcastPacket(sendValidMoves);


	},
	checkTopLeft(x, y, k){
		let isTLSpotTake = 0;

		if((x - 1) == -1 || (y - 1) == -1){
			return isTLSpotTake = 1;
		}
		else if(this.board[y - 1][x - 1] == 0){
			return isTLSpotTake = 2;
		}
		else if(this.board[y - 1][x - 1] == this.whoseTurn){
			return isTLSpotTake = 3;
		}
		else if(this.board[y - 1][x - 1] != this.whoseTurn){
			return isTLSpotTake = 4;
		}
	},
	checkTopRight(x, y, k){
		let isTRSpotTake = 0;

		if((x - 1) == -1 || (y + 1) == 8){
			return isTRSpotTake = 1;
		}
		else if(this.board[y + 1][x - 1] == 0){
			return isTRSpotTake = 2;
		}
		else if(this.board[y + 1][x - 1] == this.whoseTurn){
			return isTRSpotTake = 3;
		}
		else if(this.board[y + 1][x - 1] != this.whoseTurn){
			return isTRSpotTake = 4;
		}
	},
	checkBottomLeft(x, y, k){
		let isBLSpotTake = 0;

		if((x + 1) == 8 || (y - 1) == -1){
			return isBLSpotTake = 1;
		}
		else if(this.board[y - 1][x + 1] == 0){
			return isBLSpotTake = 2;
		}
		else if(this.board[y - 1][x + 1] == this.whoseTurn){
			return isBLSpotTake = 3;
		}
		else if(this.board[y - 1][x + 1] != this.whoseTurn){
			return isBLSpotTake = 4;
		}
	},
	checkBottomRight(x, y, k){
		let isBRSpotTake = 0;

		if((x + 1) == 8 || (y + 1) == 8){
			return isBRSpotTake = 1;
		}
		else if(this.board[y + 1][x + 1] == 0){
			return isBRSpotTake = 2;
		}
		else if(this.board[y + 1][x + 1] == this.whoseTurn){
			return isBRSpotTake = 3;
		}
		else if(this.board[y + 1][x + 1] != this.whoseTurn){
			return isBRSpotTake = 4;
		}
	},
				
};

Server.start(Game);
