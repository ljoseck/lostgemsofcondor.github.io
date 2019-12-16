class MapChunk {
	constructor(x, y, tileSize, chunkSize){
		this.x = x;
		this.y = y;
		this.tileSize = tileSize;
		this.chunkSize = chunkSize;
		
		this.clear = true;
		this.canvas = addCanvas();
		this.context = this.canvas.getContext("2d");

		
		this.canvas.width = this.tileSize * (this.chunkSize + 1);
		this.canvas.height = this.tileSize * (this.chunkSize + 1);

		this.grass = new Tile("./sprites/background/grassBasic.png", 96, 96, this.tileSize);
		this.water = new Tile("./sprites/background/waterBasic.png", 96, 96, this.tileSize);

	}
	draw(){
		for(var i = 0; i < this.chunkSize; i += 1){
			var line = [];
			for(var j = 0; j < this.chunkSize; j += 1){
				// rotateAndPaintImage(img, 10, i, j, width, height);
				//var noise = 1;
				var noise = p.perlinRec(i + this.x * this.chunkSize, j + this.y * this.chunkSize, [100], [1]);
				if(noise < .3){
					line.push(false);
					game.map.water.draw(this.context, i * this.tileSize, j * this.tileSize);
					// mapContext.drawImage(water, i, j, width, height);
				} else {
					line.push(true);
					if(noise < .4){
						game.map.sand.draw(this.context, i * this.tileSize, j * this.tileSize);
					}else if(noise < .6){
						game.map.grass.draw(this.context, i * this.tileSize, j * this.tileSize);
					}else if(noise < .7){
						game.map.forest.draw(this.context, i * this.tileSize, j * this.tileSize);
					}else if(noise < .8){
						game.map.moutain.draw(this.context, i * this.tileSize, j * this.tileSize);
					}else{
						game.map.snow.draw(this.context, i * this.tileSize, j * this.tileSize);
					}
					// mapContext.drawImage(img, i, j, width, height);
				}
				
			}
			//this.collisionMap.push(line);
		}

		this.clear = false;
	}
	get positionX(){
		return this.x * this.tileSize * this.chunkSize;
	}
	get positionY(){
		return this.y * this.tileSize * this.chunkSize;
	}
}