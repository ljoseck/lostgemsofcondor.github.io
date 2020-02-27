class ExperienceService {
    constructor(){
		this.staminaGain = 0;

		this.updateStaminaRegen();
	}
	
	get enduranceLevel(){
		if(game.save.enduranceLevel){
			return game.save.enduranceLevel;
		} else {
			return 1;
		}
    }
	set enduranceLevel(enduranceLevel) {
		game.save.enduranceLevel = enduranceLevel;
	}
    
	get endurance(){
		if(game.save.enduranceEXP){
			return game.save.enduranceEXP;
		} else {
			return 0;
		}
    }
	set endurance(enduranceEXP) {

		game.save.enduranceEXP = enduranceEXP;
		this.updateEndurance()
	}
	
	updateEndurance(){
		var lastLevel = this.nextLevelEXP(this.enduranceLevel - 1)
		var nextLevel = this.nextLevelEXP(this.enduranceLevel)
		game.hud.setSkill("endurance", lastLevel, nextLevel)
		if(this.endurance >= nextLevel){
			game.player.risingText("Endurance Level Up ").setLife(180);
			this.enduranceLevel += 1;
			this.updateStaminaRegen();
			this.updateEndurance();
		}
	}

	nextLevelEXP(level){
		if(level == 0){
			return 0;
		}
		level++;
		return Math.floor(1053.975*Math.pow(2, level/10)) - 60*level - 1054
	}

	spendStamina(s){
		this.staminaGain += s;
		var enduranceGain = Math.floor(this.staminaGain / 10);
		if(enduranceGain > 0){
			game.player.risingText(enduranceGain + "XP");
			this.endurance += enduranceGain;
			this.staminaGain -= enduranceGain * 10;
		}
	}

	updateStaminaRegen(){
		game.player.baseStaminaRegen = Math.floor(Math.pow(0.9819, this.enduranceLevel)*60);
	}
}