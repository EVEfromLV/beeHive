/**
 * Created by IevaSilina on 19/05/16.
 */
var stage;
var level = 1;
var score = 0;
var hero;

var keys = {
    rkd: false,
    lkd: false,
    ukd: false,
    dkd: false
};

var obsticles = [];

var queue;
var preLoadText;

function preLoad(){
    stage = new createjs.Stage("beeHive");
    preLoadText = new createjs.Text("0%", "70px Helvetica", "black");
    stage.addChild(preLoadText);
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
    console.log(e.progress);
    preLoadText.text = Math.round(e.progress*100) + "%";
    stage.update();
}

function startGame() {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tock);

    hero = new createjs.Bitmap("img/bee.png");
    hero.width = 150;
    hero.height = 130;
    hero.speed = 20;

    stage.addChild(hero);

    hero.x = stage.canvas.width/2;
    hero.y = 620-hero.height;

    window.addEventListener('keydown', fingerDown);
    window.addEventListener('keyup', fingerUp);

    addObsticles();
    addObsticles();
    addObsticles();

}

function addObsticles (){
    var i;
    for (i = 0; i < level; i++){
        var obsticle = new createjs.Bitmap("img/hexagon.png");
        obsticle.width = 128;
        obsticle.height = 129;

        obsticle.y = -150;
        obsticle.x = Math.floor(Math.random() * (stage.canvas.width - obsticle.width));
        stage.addChild(obsticle);
        obsticles.push(obsticle);
    }
}

function moveObsticles(){
    var i;
    var length = obsticles.length -1;

    for(i = length-1; i>=0; i--){
        obsticles[i].y += 2;
        if(obsticles[i].y > stage.canvas.height){
            obsticles[i].y = -150;
            obsticles[i].x = Math.floor(Math.random() * (stage.canvas.width - obsticles[i].width));
        }
    }

    // need to make the score move, so the obstacles move faster
    // if(score >= level * 20){
    //      obsticles[i].y++;
    //  }


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

function moveHero(){
    // need to make him not move outside of stage.canvas
    if(keys.rkd){
        hero.x+=hero.speed;
    }

    if(keys.lkd){
        hero.x-=hero.speed;
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

function checkCollisions(){
    var o;
    var oLength = obsticles.length - 1;

    for (o = oLength; o > 0; o--){
        if(hitTest(obsticles[o], hero)){
            console.log("Game Over");
            // lives--; stopGame() moveHero()stop "break;"
            obsticles.remove();

        }
    }
}

function tock (e) {
    moveObsticles();
    moveHero();
    checkCollisions();
    stage.update(e);
}