class Bullet extends Entity{
	constructor(path, speed, x, y, width, height, moving = false, angle, noCollsion = true){
		super(path, speed, x, y, width, height, moving, angle);
		this.noCollsion = noCollsion;

		game.add(this);
		// this.key = 0; // for game class
		// this.positionX = 0;
		// this.positionY = 0;
	}
}
