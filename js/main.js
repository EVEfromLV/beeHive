/**
 * Created by IevaSilina on 19/05/16.
 */
var stage;
var score = 0;
var scoreText;
var hero;

var keys = {
    rkd: false,
    lkd: false,
    ukd: false,
    dkd: false
};

var obsticles = [];
var numOfObsticles = 4;

var queue;
var preLoadText;
var gameIsRunning = false;

function preLoad(){
    stage = new createjs.Stage("beeHive");

    preLoadText = new createjs.Text("0%", "40px Helvetica", "brown");
    stage.addChild(preLoadText);
    preLoadText.x = stage.canvas.width-490;
    preLoadText.y = stage.canvas.height/3.1;

    queue = new createjs.LoadQueue(true);
    queue.on("progress", progressIs);
    queue.on("complete", startGame);

    queue.loadManifest([
        "img/bee.png",
        "img/hexagon.png"
        // audio also goes in
    ])
}

function progressIs(e) {
    preLoadText.text = Math.round(e.progress*100) + "%";
    stage.update();
}

function startGame() {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tock);

    startBtn = new createjs.Text("Start Game", "60px Helvetica", "black");
    stage.addChild(startBtn);
    startBtn.x = stage.canvas.width-600;
    startBtn.y = stage.canvas.height/2.5;
    startBtn.addEventListener('click',
        function(e){
            stage.removeChild(e.target);
            stage.removeChild(preLoadText);
            gameIsRunning = true;

            scoreText = new createjs.Text("Score: 0", "30px Helvetica", "black");
            stage.addChild(scoreText);
            scoreText.x = scoreText.y = 20;
    });

    hero = new createjs.Bitmap("img/bee.png");
    hero.width = 150;
    hero.height = 130;
    hero.speed = 20;
    stage.addChild(hero);

    hero.x = stage.canvas.width/2.3;
    hero.y = 620-hero.height;

    window.addEventListener('keydown', fingerDown);
    window.addEventListener('keyup', fingerUp);

    addObsticles();

}

function addObsticles (){
    for (var i = 0; i < numOfObsticles; i++){
        var obsticle = new createjs.Bitmap("img/hexagon.png");
        obsticle.width = 128;
        obsticle.height = 129;

        obsticle.y = stage.canvas.height;
        obsticle.x = Math.floor(Math.random() * (stage.canvas.width - obsticle.width));
        stage.addChild(obsticle);
        obsticles.push(obsticle);
    }
}

function moveObsticles(){
    var length = obsticles.length;

    //for (var i=0; i<numOfObsticles; i++){
    //    obsticles[i].y+=2;
    //}

    for(i = length-1; i>=0; i--){
        obsticles[i].y += 2;

        if(obsticles[i].y > stage.canvas.height){
            obsticles[i].y = -150;
            obsticles[i].x = Math.floor(Math.random() * (stage.canvas.width - obsticles[i].width));
        }

        //if(score >= length*score){
        //    obsticles[i].y ++;
        //}
    }


    //if (obsticles[i].y > 700){
    //    stage.removeChild(obsticles[i]);
    //   obsticles.splice(i, 1);
    //   level+=0.25;
    //}

//stage.removeChild(obsticles[i]);
//obsticles.splice (o, 1);
//if (length === 0){
//  level++;
//  addObsticles();
//}
//break;

}


function fingerUp(e){
    if(e.keyCode === 37){
        keys.lkd = false;
    }

    if(e.keyCode === 39){
        keys.rkd = false;
    }
}

function fingerDown(e){
    if(e.keyCode === 37){
        keys.lkd = true;
    }
    if(e.keyCode === 39){
        keys.rkd = true;
    }
}

function moveHero() {
    var stageLimit = stage.canvas.width;

    if (keys.rkd){
        if (hero.x <= stageLimit-160) {
            hero.x += hero.speed;
        }
    }

    if (keys.lkd) {
        if (hero.x > 10) {
            hero.x -= hero.speed;
        }
    }
}

function checkCollisions(){
    for (var i=0; i<numOfObsticles; i++){
        if(hitTest(obsticles[i], hero)){
            gameIsRunning=false;
            gameOverText = new createjs.Text("Game Over", "70px Helvetica", "black");
            gameOverText.x = stage.canvas.width-600;
            gameOverText.y = stage.canvas.height/2.5;
            stage.addChild(gameOverText);

            //restartGame = new createjs.Text("TRY AGAIN", "30px Helvetica", "red");
            //restartGame.x = stage.canvas.width-500;
            //restartGame.y = stage.canvas.height/1.9;
            //stage.addChild(restartGame);
            }
        }
}

function hitTest(rect1,rect2) {
    if ( rect1.x >= rect2.x + rect2.width
        || rect1.x + rect1.width <= rect2.x
        || rect1.y >= rect2.y + rect2.height
        || rect1.y + rect1.height <= rect2.y )
    {
        return false;
    }
    return true;
}

function tock (e) {
   if(gameIsRunning===true){
        score++;
       scoreText.text = "Score: " +score;
        moveObsticles();
        moveHero();
        checkCollisions();
    }
    stage.update(e);
}