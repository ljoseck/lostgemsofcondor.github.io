class MiniMapChunk {
	constructor(x, y, miniChunkSize, mapChunkPerMiniMapChunk){
		this.x = x;
		this.y = y;
		this.miniChunkSize = miniChunkSize;
		this.mapChunkPerMiniMapChunk = mapChunkPerMiniMapChunk;


		this.seen = [];
		
		//this.clear = true;
		this.canvas = main.addCanvas();
		this.context = this.canvas.getContext("2d");
		
		this.canvas.width = this.miniChunkSize;
		this.canvas.height = this.miniChunkSize;
		this.reload();
		
		this.unbound = false;
	}

	get positionX(){
		return this.x * this.miniChunkSize;
	}

	get positionY(){
		return this.y * this.miniChunkSize;
	}

	reload(){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.seen = [];
		for(var i = 0; i < this.mapChunkPerMiniMapChunk; i++){
			var temp = []
			for(var j = 0; j < this.mapChunkPerMiniMapChunk; j++){
				temp.push(false);
			}
			this.seen.push(temp);
		}
		
	}
	
	addChunkImage(imgData, x, y){ // x and y in terms of map chunks
		this.putImageData(imgData, main.correctMod(x, this.mapChunkPerMiniMapChunk), main.correctMod(y, this.mapChunkPerMiniMapChunk));
	}

	putImageData(imgData, x, y){ // x and y in terms of chunks
		this.seen[x][y] = true;
		this.context.putImageData(imgData, x * game.map.chunkSize, y * game.map.chunkSize);
	}

}
