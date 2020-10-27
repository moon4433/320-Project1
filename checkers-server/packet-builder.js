

exports.PacketBuilder = {

	join(responseID, game){
		const packet = Buffer.alloc(70);

		packet.write("JOIN", 0);
		packet.writeUInt8(responseID, 4);
		packet.writeUInt8(game.whoseTurn, 5);

		let offset = 6;
		for(let y = 0; y < game.board.length; y++){
			for(let x = 0; x < game.board[y].length; x++){

				packet.writeUInt8(game.board[y][x], offset);
				offset++;

			}
		}

		return packet;
	},
	chat(usernameFrom, message){

		const packet = Buffer.alloc(7 + usernameFrom.length + message.length);
		packet.write("CHAT", 0);
		packet.writeUInt8(usernameFrom.length, 4);
		packet.writeUInt16BE(message.length, 5);
		packet.write(usernameFrom, 7);
		packet.write(message, 7 + usernameFrom.length);
		return packet;
	},
	update(game){

		const packet = Buffer.alloc(70);
		packet.write("UPDT", 0);
		packet.writeUInt8(game.whoseTurn, 4);
		packet.writeUInt8(game.whoHasWon, 5);

		let offset = 6;
		for(let y = 0; y < game.board.length; y++){
			for(let x = 0; x < game.board[y].length; x++){

				packet.writeUInt8(game.board[y][x], offset);
				offset++;

			}
		}

		return packet;
	},
	notValid(){
		const msg = "Not a Valid move.";
		const packet = Buffer.alloc(5 + msg.length);
		packet.write("NVLD", 0);
		packet.writeUInt16BE(msg.length, 4);
		packet.write(msg, 6);
		return packet;
	},
	validMoves(tlX, tlY, trX, trY, blX, blY, brX, brY){

		const packet = Buffer.alloc(12);
		packet.write("VDMV", 0);
		packet.writeUInt8(tlY,4);
		packet.writeUInt8(tlX,5);
		packet.writeUInt8(trY,6);
		packet.writeUInt8(trX,7);
		packet.writeUInt8(blY,8);
		packet.writeUInt8(blX,9);
		packet.writeUInt8(brY,10);
		packet.writeUInt8(brX,11);
		return packet;

	},

};