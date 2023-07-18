////////////////////////////////////////
////////BOXING GAME: Box Puncher////////
////////////////////////////////////////


let training_data = [
  {
    // player right
    inputs: [0, 1, 0, 0, 0.5],
    outputs: [1, 0, 0, 0]
  },  
  {
    // player left
    inputs: [1, 0, 0, 0, 0.5],
    outputs: [1, 0, 0, 1]
  },
  {
    // player left and punch
    inputs: [1, 0, 1, 0, 0.5],
    outputs: [0, 1, 0, 0]
  },
  {
    // player left (different output)
    inputs: [1, 0, 0, 0, 0.5],
    outputs: [1, 0, 1, 0]
  },
  {
    // player right and block
    inputs: [0, 1, 0, 1, 0.5],
    outputs: [1, 0, 1, 0]
  },
  {
    // player punch
    inputs: [0, 0, 1, 0, 0.5],
    outputs: [1, 0, 0, 1]
  },
  {
    // player block
    inputs: [0, 0, 0, 1, 0.5],
    outputs: [1, 0, 1, 0]
  },
  {
    // player block (different output)
    inputs: [0, 0, 0, 1, 0.5],
    outputs: [1, 0, 0, 1]
  },
  {
    // No player inputs
    inputs: [0, 0, 0, 0, 0.5],
    outputs: [0, 0, 0, 0]
  },
  {
    // player right and punch
    inputs: [0, 1, 1, 0, 0.5],
    outputs: [0, 0, 0, 1]
  }
];

let player;
let enemy;

let choice = "";

let inputs = [0, 0, 0, 0, 0.5];

function setup(){
    
    createCanvas(1024, 576);
    floorPos_y = height * 3/4;

    nn = new NeuralNetwork(5, 9, 4);
    // amount of nodes on neural network
    player = new Player(true, "white")
    enemy = new Player(false, "orange")
    

    // create a stamina regeneration cycle
    let stamCycle = setInterval(function(){
        player.stamina+=5;
        enemy.stamina+=5;
    }, 2000)


    alert("WELCOME TO BOX PUNCHER!!\nPlease select to play a two player game by pressing \'p\'\nOr play against the ai with \'o\'")
//alert message that will pop up when game is run
    
}

function aiGame(){
//function for game mode to fight against
    enemy.isBot = true;
    if(enemy.life <= 0){
        player.isPunching = false;
        player.isBlocking = false;
        player.win();
        //calls win method that displays a message when life = 0
    }
    else if(player.life <= 0){
        player.isPunching = false;
        player.isBlocking = false;
        enemy.win();
        //calls win method that displays a message when life = 0
    }

    inputs = player.inputs;

    nn.setLearningRate(0.25);

    let y = nn.predict(inputs);
    y = y.map(function(each_element){
        return Math.round(each_element);
    });
    //predicts inputs of player for Ai to produce output
    
    y[0]==1?(enemy.direction=enemy.posX<player.posX+100?"right":"left"):y[1]==1?(enemy.direction=enemy.posX<player.posX+100?"left":"right"):enemy.direction=(enemy.posX<player.posX+110?"right":"");
console.log(enemy.direction)
    //controls the direction of the character when it moves
    enemy.isPunching = (y[3]==1?true:false);
    enemy.isBlocking = (y[2]==1?true:false)

    enemy.update();
    player.update();
    //updates character positions
    
        
//    console.log(y);
    

    if(enemy.isPunching){
        if(enemy.posX <= player.posX + 140 && enemy.posX > player.posX && player.isBlocking == false){
            player.life-=1;
        }
    }
    if(player.isPunching){
        if(player.posX  + 150 >= enemy.posX && player.posX < enemy.posX && enemy.isBlocking == false){
            enemy.life-=1;
        }
    }
    //punch collision to remove life when the punch is close enough to the Ai
}

function twoPlayerGame(){
    //2 player mode 
    console.log(enemy.posX);
    if(enemy.life <= 0){
        player.win();
        //calls win method that displays a message when life = 0
    }
    else if(player.life <= 0){
        enemy.win();
        //calls win method that displays a message when life = 0
    }

    enemy.update();
    player.update();
    //updates player and enemy positions after a movement is used 

    if(enemy.isPunching){
        if(enemy.posX <= player.posX + 140 && enemy.posX > player.posX && player.isBlocking == false){
            player.life-=1;
        }
    }
    if(player.isPunching){
        if(player.posX  + 150 >= enemy.posX && player.posX < enemy.posX && enemy.isBlocking == false){
            enemy.life-=1;
        }
    }
    //punch collision to remove life when the punch is close enough to the player
}

function draw(){
    for (let i = 0; i < 10; i++) {
        let data = random(training_data);
        nn.train(data.inputs, data.outputs);
    }
    //loops through the training data, and based on the input from the player, there will be a specific output from the enemy

    background(100,155,255); //fill the sky blue

    noStroke();
    fill(150,200,150);
    rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground
    
    
//Onscreen lives for player and enemy
    fill(0);
    noStroke();
    textSize(25);
    text("Life: " + Math.round(player.life>=0?player.life:0),10,30);
    
    fill(0);
    noStroke();
    textSize(25);
    text("Life: " + Math.round(enemy.life>=0?enemy.life:0),850,30);
    
//Onscreen stamina for player and enemy
    fill(0);
    noStroke();
    textSize(25);
    text("Stamina: " + Math.round(player.stamina),10,60);
    
    fill(0);
    noStroke();
    textSize(25);
    text("Stamina: " + Math.round(enemy.stamina),850,60);
    
    if(choice == "ai"){
        aiGame();
    }
    else if(choice == "2p"){
        twoPlayerGame();
    }
    else if(choice == ""){
	fill("darkred");
	noStroke();
    	textSize(50);

        text(" Two player game press \'p\'\nSingle player game press \'o\'",200,200);
    }
    //allows player to choose from either playing against another player for 2 player mode, or against the ai
    //console.log(inputs);
}


function keyPressed(){
    console.log(keyCode, key);
    // if statements to control the animation of the character when
    // keys are pressed.
    console.log(keyCode);

    if(choice == ""){
        if(key == "P"){
            choice = "2p"
        }
        if(key == "O"){
            choice = "ai"
        }
        //key presses to choose which game mode they would like to 
    }

    if(keyCode == 65 && player.direction!='right'){
        inputs[0]=1;
        player.direction ="left"
    }
    //takes in input for player moving right
    else if(keyCode == 68&&player.direction!='left'){
        inputs[1]=1;
        player.direction="right";
    }
    //takes in input for player moving left
    if(choice == "2p"){
        if(keyCode == RIGHT_ARROW){
            enemy.direction ="right"
        }
        else if(keyCode == LEFT_ARROW){
            enemy.direction="left";
        }
        if(keyCode == DOWN_ARROW){
            enemy.isBlocking = true;
        }
        if(keyCode == UP_ARROW){
            enemy.isPunching = true;
        }
        // key presses for different movement for player 2
    }
    

	if(key == "W")
	{
        player.isPunching = true;
        console.log("Punch");
        inputs[3] = 1;
	}
    //punching, taken as an input by Ai
    else
    {
        inputs[3] = 0;
    }
    
    if(key == 's' || keyCode == 83)
    {
        player.isBlocking = true;
        console.log("Enemy Block");
    }
    //blocking
    else
    {
        inputs[2] = 0;
    }
}

function keyReleased()
{
    // if statements to control the animation of the character when
    // keys are released and takes in the inputs for the movements done
    if(keyCode == 65 && player.direction!='right'){
        inputs[0]=0;
        player.direction =""
    }
    else if(keyCode == 68&&player.direction!='left'){
        inputs[1]=0;
        player.direction="";
    }
    
    if(key == "W")
    {
        player.isPunching = false;
        inputs[3]=0;
    }

    if(choice == "2p"){
        if(keyCode == RIGHT_ARROW){
            enemy.direction =""
        }
        else if(keyCode == LEFT_ARROW){
            enemy.direction="";
        }
        if(keyCode == DOWN_ARROW){
            enemy.isBlocking = false;
        }
        if(keyCode == UP_ARROW){
            enemy.isPunching = false;
        }
    }
    
    
    if(key == 'S'){
        player.isBlocking = false;
        inputs[2] = 0;
    }
    
    
}
