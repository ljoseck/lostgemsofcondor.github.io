class Hud {
    constructor(){
		this.canvas = main.addCanvas();
        this.context = this.canvas.getContext("2d");

        this.width = 384;
        this.height = 1080;
        
        this.hudImg = new Image();
        this.hudImg.src = "./sprites/hud/hud.png";
        
        this.consoleImg = new Image();
        this.consoleImg.src = "./sprites/hud/console.png";


        this.menuImg = new Image();
        this.menuImg.src = "./sprites/hud/menu.png";
        this.menuSingleImg = new Image();
        this.menuSingleImg.src = "./sprites/hud/menuSingle.png";
        
        this.menuTopImg = new Image();
        this.menuTopImg.src = "./sprites/hud/menuTop.png";
        this.menuBottomImg = new Image();
        this.menuBottomImg.src = "./sprites/hud/menuBottom.png";

        this.windowTopLeft = new Image();
        this.windowTopLeft.src = "./sprites/hud/windowTopLeft.png";
        this.windowTopRight = new Image();
        this.windowTopRight.src = "./sprites/hud/windowTopRight.png";
        this.windowBottomLeft = new Image();
        this.windowBottomLeft.src = "./sprites/hud/windowBottomLeft.png";
        this.windowBottomRight = new Image();
        this.windowBottomRight.src = "./sprites/hud/windowBottomRight.png";

        this.console = new Window(0, this.height - 256).setWidth(512).setHeight(256);
        this.consoleLog = [];

        this.entityInfo = new EntityInfo();
        

        //inventory dimensions
        this.inventoryX = 45;
        this.inventoryY = 510;
        this.itemSize = 48;
        this.slotSize = 66; //including gap
        this.slotGap = this.slotSize - this.itemSize;

        this.temp = 0;
        this.temp2 = 0;

        this.skillUpdated = -1;

    }

    get offset(){
        return main.canvas.width - this.width;
    }

    resize(){
        this.canvas.width = game.width;
        this.canvas.height = game.height;
    }

    redraw(){
        this.clearCanvas();
        this.draw();
    }

    clearCanvas(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw(){
        //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.addHealthBar();
        this.addStaminaBar();

        this.addToContext(this.hudImg, this.offset, 0, this.width, this.height);
        this.addSkillBar();
        this.drawConsole();
        this.addText();
        this.entityInfo.draw(this.context);
        this.drawItems();
        this.drawRightClickMenu();
    }

    addText(){
        var x = this.offset + 12;
        var y = 920;
        this.context.font = "14px pixel_font";
        this.context.textAlign = "left";

		this.context.fillStyle = game.config.black;
        this.context.fillText("Press the space to dash", x, y);
        this.context.fillText("Hold shift to fire arrows", x, y+14);

        this.context.fillText("Endurance Level: " + game.experienceService.enduranceLevel, x, y+14*4);
        this.context.fillText("Endurance EXP: " + game.experienceService.endurance, x, y+14*5);
        this.context.fillText("Endurance EXP to", x, y+14*6);
        this.context.fillText("Next Level: " + game.experienceService.nextLevelEXP(game.experienceService.enduranceLevel), x, y+14*7);
    }

    addHealthBar(){
        var x = this.offset + 42;
        var y = 99;
        var width = 300;
        var height = 24;
        var health = game.player.health;
        var maxHealth = game.player.maxHealth;

        this.context.fillStyle = game.config.healthGreen;
        this.context.fillRect(x, y, width, height);
        
        this.context.fillStyle = game.config.lightGray;
        this.context.fillRect(x + width * health/maxHealth, y, width - width * health/maxHealth, height);

        this.context.font = "20px pixel_font";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
		this.context.fillStyle = game.config.gray;
        this.context.fillText(health + "/" + maxHealth, x + width/2, y + height/2);

    }

    addStaminaBar(){
        var x = this.offset + 42;
        var y = 135;
        var width = 300;
        var height = 24;
        var stamina = game.player.stamina;
        var maxStamina = game.player.maxStamina;

        this.context.fillStyle = game.config.staminaOrange;
        this.context.fillRect(x, y, width, height);
        
        this.context.fillStyle = game.config.lightGray;
        this.context.fillRect(x + width * stamina/maxStamina, y, width - width * stamina/maxStamina, height);

        this.context.font = "19px pixel_font";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
		this.context.fillStyle = game.config.gray;
        this.context.fillText(stamina + "/" + maxStamina, x + width/2, y + height/2);
    }

    addSkillBar(){
        if(this.skillUpdated < game.gameTick){
            return;
        }
        var x = this.offset - 300;
        var y = 30;
        var width = 247;
        var height = 30;

        

        var current = game.experienceService[this.skill];
        var last = this.skillLast;
        var max = this.skillNext;
        

        this.context.fillStyle = game.config.expGold;
        this.context.fillRect(x, y, width, height);
        
        this.context.fillStyle = game.config.lightGray;
        this.context.fillRect(x + width * (current - last)/(max - last), y, width - width * (current - last)/(max - last), height);

        this.context.font = "20px pixel_font";
        this.context.fillStyle = game.config.gray;
        
        this.context.textAlign = "left";
        this.context.textBaseline = "top";
        this.context.fillText(this.skillText, x, y - 20);
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillText(current + "/" + max, x + width/2, y + height/2);
    }

    addToContext(img, x, y, width = null, height = null){
        if(width && height){
            this.context.drawImage(img, x, y, width, height)
        } else {
            this.context.drawImage(img, x, y);
        }
    }

    clickOnHud(x, y){
        if(x >= this.offset || this.console.clicked(x, y) || (game.menu && game.menu.clicked(x, y))){
            return true;
        } else {
            delete game.menu;
            return false;
        }
    }

    handleClick(x, y){
        if(game.mouse.left.start){
            this.handleClickStart(x, y);
        } else if(game.mouse.left.end){
            this.handleClickEnd(x, y);

        } else {
            
        }
        //this.addToContext(game.map.grass.img, x, y, game.map.grass.width, game.map.grass.height);
    }

    inventorySlotX(x){
        return this.offset + this.inventoryX + x * this.slotSize;
    }
    
    inventorySlotY(y){
        return this.inventoryY + y * this.slotSize;
    }

    log(text){
        if(text){
            this.console.open = true;
            this.consoleLog.push(text);
        }
    }

    handleClickStart(x, y){
        if((game.menu && game.menu.clicked(x, y))){
            var option = game.menu.clickedOption(x, y);
            if(option){
                option.execute();
                if(option.log != null){
                    this.log(option.log);
                }
                delete game.menu;
            }
            return;
        } else {
            delete game.menu;
        }

        if(this.console.clicked(x, y) == 2){
            this.console.open = false;
            return;
        }

        var x = this.getSlotX(x);
        var y = this.getSlotY(y);
        if(x != null && y != null && game.inventory.get(x, y)){
            var item = game.inventory.get(x, y);
            if(item != null){
                this.clickItem(item);
            }
        }
    }

    handleClickEnd(x, y){
        var slotX = this.getSlotX(x);
        var slotY = this.getSlotY(y);
        if(game.mouse.holdingItem && slotX != null && slotY != null && game.inventory.get(slotX, slotY) == null){
            var item = game.inventory.getWithKey(game.mouse.heldItem);
            item.move(slotX, slotY);
            //move selected item
        } 
        if(!this.clickOnHud(x, y) && game.mouse.holdingItem){
            var item = game.inventory.getWithKey(game.mouse.heldItem);
            item.droppedByPlayer = true;
            game.player.drop(item);
            
        }
        game.mouse.holdingItem = false;
        game.mouse.heldItem = -1;
    }

    clickItem(item){
        game.mouse.holdingItem = true;
        game.mouse.heldItem = item.itemKey;
    }

    getSlotX(x){
        x = x - this.inventorySlotX(0) + this.slotGap/2;
        if(x % this.slotSize < this.itemSize + this.slotGap){
            return Math.floor(x / this.slotSize)
        } else {
            return null;
        }
    }

    getSlotY(y){
        y = y - this.inventorySlotY(0) + this.slotGap/2;
        if(y % this.slotSize < this.itemSize + this.slotGap){
            return Math.floor(y / this.slotSize)
        } else {
            return null;
        }
    }

    drawItems(){
        this.context.font = "14px pixel_font";
        this.context.textAlign = "left";
        this.context.textBaseline = "hanging";

        this.context.fillStyle = game.config.black;
        
        var heldItem = null
        for(var j = 0; j < game.inventory.height; j++){
            for(var i = 0; i < game.inventory.width; i++){
                var item = game.inventory.get(i, j);
                if(item != null){
                    if(game.mouse.heldItem == item.itemKey){
                        heldItem = item;
                    } else {
                        var img = game.itemSprites[item.itemSpriteKey];
                        var x = this.inventorySlotX(item.x);
                        var y = this.inventorySlotY(item.y);
                        this.context.drawImage(img, x, y);
                        if(item.amount > 1){
                            this.context.fillText(item.amount, x, y);
                        }
                    }
                }
            }
        }
        if(heldItem != null){
            var img = game.itemSprites[heldItem.itemSpriteKey];
            this.context.drawImage(img, game.mouse.x, game.mouse.y);
        }
    }
    
    setSkill(skill, skillLast, skillNext){
        this.skill = skill;
        this.skillLast = skillLast;
        this.skillNext = skillNext;
        this.skillUpdated = game.gameTick + 600;
        this.skillText = "Endurance Progress"
    }

    drawRightClickMenu(){
        if(game.menu && game.menu.options.length > 0){
            this.context.font = "19px pixel_font";
            this.context.textBaseline = "middle";
            this.context.fillStyle = game.config.black;
            var offsetY = 0;
            offsetY += this.menuHelper(this.menuTopImg, game.menu.x, game.menu.y + offsetY);
            var i;
            for(i = 0; i < game.menu.options.length - 1; i += 2){
                offsetY += this.menuHelper(this.menuImg, game.menu.x, game.menu.y + offsetY);
                this.context.fillText(game.menu.options[i].getText(), game.menu.x + 48, game.menu.y + offsetY - 80+18);
                this.context.fillText(game.menu.options[i + 1].getText(), game.menu.x + 48, game.menu.y + offsetY - 80+58);
                
            }
            if(game.menu.options.length%2 == 1){
                offsetY += this.menuHelper(this.menuSingleImg, game.menu.x, game.menu.y + offsetY);
                this.context.fillText(game.menu.options[i].getText(), game.menu.x + 48, game.menu.y + offsetY - 40+18);
            }
            offsetY += this.menuHelper(this.menuBottomImg, game.menu.x, game.menu.y + offsetY);

            game.menu.height = offsetY;
        }
    }

    menuHelper(img, x, y){
        this.context.drawImage(img, x, y);
        return img.height;
    }

    drawConsole(){
        if(this.console.open){
            this.console.draw(this.context);

            this.context.font = "19px pixel_font";
            this.context.textAlign = "left";
            this.context.textBaseline = "bottom";
    
            this.context.fillStyle = game.config.black;
            var offsetY = 0;
            for(var i = this.consoleLog.length - 1; i >= 0; i--){
                var strings = this.consoleLog[i].split("\n").reverse();
                for(var s in strings){
                    if(offsetY > 200){
                        return;
                    }
                    this.context.fillText(strings[s], this.console.x + 20, this.console.y + this.console.height - 20 - offsetY);
                    offsetY += 20
                }
            }
        }
    }
}