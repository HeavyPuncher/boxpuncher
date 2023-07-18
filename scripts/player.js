//Class file for players to be made

class Player {
    constructor(isMain, color) {
        this.posX = (isMain?1024 / 2:1024);
        this.posY = 576 * 3 / 4;
        this.punchX = (isMain?1024 / 2:1024-40);
        this.punchY = 576 * 3 / 4;
        this.inputs = [0, 0, 0, 0, 0]; // left, right, punch, block, stamina
        this.color = color;
        this.isMain = isMain; // boolean for determining if player1

        this.isPunching = false;
        this.life = 100;
        this.stamina = 100;
        this.isBlocking = false;
        this.direction = "";
        this.isBot = false; // boolean for determining if AI
    }

    //Blocking menthod for when blocking is used
    blocking() {
        strokeWeight(3);
        stroke(50);
        fill(this.color)
        rect(this.posX - 300, this.posY - 150, 60, 50);
        fill(0);
        rect(this.posX - (this.isMain?265:300), this.posY - 130, 25, 20);
        fill(this.color)
        rect(this.posX - 310, this.posY - 20, 80, -80);
        fill(this.color)
        rect(this.posX - (this.isMain?230:340), this.posY - 60, 30, -80); //block rectangle
        fill(0, 0, 0);
        rect(this.posX - 300, this.posY - 20, 60, 20);
        this.stamina -= (this.isBot?0.3:0.2);

        //this.punchX = false;
        this.inputs[2] = 1;
    }
    //punching method for when punching is used
    punching() {

        strokeWeight(3);
        stroke(50);
        fill(this.color)
        rect(this.punchX - (this.isMain?277:302), this.punchY - 60, 80, -30);

        //this.punchX += 18;
        
        this.inputs[3] = 1;

        this.stamina-=(this.isBot?0.6:0.3);
    }
    //calling an anonymous function (function without a name)

    //displays player graphics
    display() {
        this.inputs[0] = 0;
        this.inputs[1] = 0;
        strokeWeight(3);
        stroke(50);
        fill(this.color)
        rect(this.posX - 300, this.posY - 150, 60, 50);
        fill(0);
        rect(this.posX - (this.isMain?265:300), this.posY - 130, 25, 20);
        fill(this.color)
        rect(this.posX - 310, this.posY - 20, 80, -80);
        fill(0);
        rect(this.posX - 300, this.posY - 20, 60, 20);
        fill(this.color)
        rect(this.punchX - 290, this.punchY - 60, 80, -30); // Arm
    }
    //method to control player movement and change in positions
    move() {

        if (this.direction == "left") {
            this.inputs[0] = 1;

            this.posX -= 5;
            this.punchX -=5;
            console.log("Moving left");

        }

        else if (this.direction == "right") {
            this.inputs[1] = 1;

            this.posX += 5;
            this.punchX += 5;
            console.log("Moving right");
            console.log(enemy.eX);
        }
    }
    //stops the player from going passed the wall
    wallCollide() {
        if (this.posX < 300) {
            this.posX = this.posX += 5;
            console.log("left wall collision");
        }
        if (this.posX > 1240) {
            this.posX = this.posX -= 5;
            console.log("right wall collision");
        }
    }
    //displays a message depending on if the player won or lost against either the 2nd player or the AI
    win() {
        if (this.isBot) {
            fill("red");
            noStroke();
            textSize(50);
            text("Game over - you lost!", width - 750, height / 3)
            this.isBlocking = false;
            this.isPunching = false;
            return;

        } else if(this.isMain) {
            fill(0, 255, 0);
            noStroke();
            textSize(50);
            text("Congratulations Player 1 - you won!", width - 900, height / 3)
            this.isBlocking = false;
            this.isPunching = false;
            return;
        } else {
            fill(0, 255, 0);
            noStroke();
            textSize(50);
            text("Congratulations Player 2 - you won!", width - 900, height / 3)
            this.isBlocking = false;
            this.isPunching = false;
            return;
        }
    }
    //update positions, life, and stamina when they are changed
    update(){
        if (this.stamina <= 0) {
            this.stamina = 0;
            console.log("stam inc")
            this.isPunching = false;
            this.isBlocking = false;
        } else if (this.stamina >= 100) {
            this.stamina = 100;
//            console.log("stamina cap at 100");//            console.log("stamina cap at 100");
        }
        if(this.posX < 310){
            this.direction = "";
            this.posX++;
            this.punchX++;
        }
        else if(this.posX > (this.isMain?1232:1250)){
            this.direction = "";
            this.posX--;
            this.punchX--;
        }
        
        this.move();
        if(this.isBlocking && this.stamina > 0){
            this.blocking();
        }
        else if(this.isPunching && this.stamina > 0){
            this.display();
            this.punching();
        }
        else{
            this.display();
        }
    }
}