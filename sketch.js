

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var heroPosition = "right";

//count = 0;

var hero;
var ground, groundImage;

var zombieGroup,dangerousZombieGroup,zombieImage,dangerousZombieImage;
var bullet,bulletImage , bulletGroup;
var backgroundImg
var score=0;
var jumpSound, collidedSound;
var zombie , dangerousZombie;
var gameOver, restart;
var platform,platformImage;
var invisibleGround;
var maxZombie = 100;
gameState = PLAY;
var restart,restartImage;
var gameOver,gameOverImage;
var firstAid;

function preload(){
  ambulanceImage = loadImage("images/firstAid.png");
  heroLeftImage = loadImage("images/shooterLeft.png")
  heroRightImage = loadImage("images/shooterRight.png");
  heroStandingImage = loadImage("images/standingShooter.png")
  heroDeadImage  = loadImage("images/smoke.png");
  
  groundImage = loadImage("images/ground.png");
  backgroundImg = loadImage("images/background.png")
  zombieImage = loadImage("images/zombie.png")
  dangerousZombieImage = loadImage("images/dangerousZombie.png")

  platformImage = loadImage("images/platform.png")
  bulletLeftImage = loadImage("images/bulletLeft.png")
  bulletRightImage = loadImage("images/bulletRight.png")

  restartImage = loadImage("images/restart.png");
  gameOverImage = loadImage("images/GameOver.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  ground = createSprite(width/2,height-10,width,20);
  ground.addImage(groundImage);
  
  hero = createSprite(50,height-70,100,150);
  hero.addImage(heroRightImage);
  //hero.addImage("shooter",heroRightImage);
  
  zombieGroup = new Group();
  bulletGroup = new Group();
  dangerousZombieGroup = new Group();

  gameOver = createSprite(width/2,height/2 - 200);
  gameOver.addImage(gameOverImage);
  gameOver.visible = false;


  restart = createSprite(width/2,height/2);
  restart.addImage(restartImage);
  restart.visible = false;

  


  
}

function draw() {
  
  background(backgroundImg);
  
  
  if(gameState === PLAY){
    ground.display();
    spawnZombie();
    spawnDangerousZombie();
    //firstAid.visible = false;
    if(keyDown("LEFT_ARROW")){
      hero.x = hero.x - 10;
      heroPosition = "left";
      hero.addImage(heroLeftImage);
    }
    if(keyDown("RIGHT_ARROW")){
      hero.x = hero.x + 10;
      heroPosition = "right";
      hero.addImage(heroRightImage)
    }
    
  
    dangerousZombieGroup.collide(ground);
    if(dangerousZombieGroup.x > width || dangerousZombieGroup.x < 0){
      dangerousZombieGroup.velocityX = (-1) * dangerousZombieGroup.velocityX;
    }
    
    zombieGroup.collide(ground);

    if(keyDown("space") && heroPosition === "right"){
    bullet = createSprite(1,1,10,10)
    bullet.addImage(bulletRightImage)
    bullet.x = hero.x + 10
    bullet.y = hero.y
    bullet.velocityX = 10
    bulletGroup.add(bullet);
    bullet.lifetime = 200;
    }

    if(keyDown("space") && heroPosition === "left"){
    bullet = createSprite(1,1,10,10)
    bullet.addImage(bulletLeftImage)
    bullet.x = hero.x - 10
    bullet.y = hero.y
    bullet.velocityX = -10
    bulletGroup.add(bullet);
    bullet.lifetime = 200;
    }
    for(var i = 0;i < zombieGroup.length; i++){
      if(bulletGroup.isTouching(zombieGroup.get(i))){
        score = score + 20;
        zombieGroup.get(i).destroy();
        bulletGroup.destroyEach();
      }
    }
    for(var i = 0;i < zombieGroup.length; i++){
      if(dangerousZombieGroup.isTouching(zombieGroup.get(i))){
        zombieGroup.get(i).destroy();
      }
    }
  
    for(var i = 0;i < dangerousZombieGroup.length; i++){
      if(bulletGroup.isTouching(dangerousZombieGroup.get(i))){
        score = score + 100;
        dangerousZombieGroup.get(i).destroy();
        bulletGroup.destroyEach();
      }
    }
  

    if(zombieGroup.isTouching(hero)){
      gameState = "pause";
      if(hero.x > 100){
        firstAid = createSprite(hero.x - 100,hero.y)
        firstAid.addImage(ambulanceImage);
        firstAid.scale = 0.3
      }
      else{
        firstAid = createSprite(hero.x + 100,hero.y)
        firstAid.addImage(ambulanceImage);
        firstAid.scale = 0.3
      }
      
      zombieGroup.destroyEach();
      dangerousZombieGroup.destroyEach();
    }

    if(dangerousZombieGroup.isTouching(hero)){
      gameState = END;
    
      if(heroPosition === "right"){
        hero.addImage(heroDeadImage);
        
        //hero.setCollider("rectangle",0,0,60,20);
        
        
        hero.collide(ground);
      }
      else if(heroPosition === "left"){
        hero.addImage(heroDeadImage);
        
        //hero.setCollider("rectangle",0,0,60,20);

        

        hero.collide(ground);

      }
    }
  }
  else if(gameState === "pause"){
    
    firstAid.visible = true;
    if(confirm("First Aid Arrived...!!! Wait for me Zombies just coming back")){
      gameState = PLAY;
      hero.addImage(heroStandingImage)
      firstAid.visible = false;
    }
      
        
  }

  else if(gameState === END){
    gameOver.visible = true;
    restart.visible = true;
    //hero.destroy();
    zombieGroup.destroyEach();
    dangerousZombieGroup.destroyEach()
    if(mousePressedOver(restart)) {
      reset();
    }
  }

  hero.collide(ground);
  drawSprites();
  textSize(50);
  fill("red")
  text("Score: "+ score,30,50);
}

function spawnZombie(){
  if(frameCount % 150 === 0){
    zombie = createSprite(random(0,width),-20,30,30);
    zombie.addImage(zombieImage);
    zombie.velocityY = 5;
    
    zombie.setCollider("rectangle",0,0,60,60);
    zombie.lifetime = 300;
    //zombie.debug = true;
    zombieGroup.add(zombie);
  }
  
}

function spawnDangerousZombie(){
  if(frameCount % 500 === 0){
    dangerousZombie = createSprite(random(0,width),-20,30,30);
    dangerousZombie.addImage(dangerousZombieImage);
    dangerousZombie.velocityY = random(5,10);
    dangerousZombie.velocityX = random(-8,8);
    dangerousZombie.setCollider("rectangle",0,0,60,100);
    //zombie.debug = true;
    dangerousZombieGroup.add(dangerousZombie);
    zombie.lifetime = 600;

  }
  
}

function reset(){
      gameState = PLAY;
      score = 0;
      gameOver.visible = false;
      restart.visible = false;
      hero.addImage(heroStandingImage)
}






