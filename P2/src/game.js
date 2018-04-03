var sprites = {
 camarero: { sx: 513, sy: 0, w: 54, h: 64, frames: 1 },
 cliente: { sx: 513, sy: 67, w: 31, h: 35, frames: 1 },
 empty_beer: { sx: 510, sy: 140, w: 26, h: 25, frames: 1 },
 beer: { sx: 513, sy: 103, w: 22, h: 28, frames: 1 },
 fondo: {sx: 0, sy: 479, w: 514, h: 481, frames: 1 }
};

var enemies = {
  straight: { x: 27,   y: 90, sprite: 'cliente', E: 100 },
  ltr:      { x: 0,   y: -100, sprite: 'enemy_purple', health: 10, 
              B: 75, C: 1, E: 100, missiles: 2  },
  circle:   { x: 250,   y: -50, sprite: 'enemy_circle', health: 10, 
              A: 0,  B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI/2 },
  wiggle:   { x: 100, y: -50, sprite: 'enemy_bee', health: 20, 
              B: 50, C: 4, E: 100, firePercentage: 0.001, missiles: 2 },
  step:     { x: 0,   y: -50, sprite: 'enemy_circle', health: 10,
              B: 150, C: 1.2, E: 75 }
};

var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16,
    OBJECT_BEER = 32,
    OBJECT_CLIENTE = 64,
    OBJECT_DEADZONE = 128;

var startGame = function() {
  var ua = navigator.userAgent.toLowerCase();

  // Only 1 row of stars
  if(ua.match(/android/)) {
    Game.setBoard(0,new Starfield(50,0.6,100,true));
  } else {
    Game.setBoard(0,new Starfield(20,0.4,100,true));
    Game.setBoard(1,new Starfield(50,0.6,100));
    Game.setBoard(2,new Starfield(100,1.0,50));
  }  
  Game.setBoard(3,new TitleScreen("Alien Invasion", 
                                  "Press fire to start playing",
                                  playGame));
};

var level1 = [
 // Start,   End, Gap,  Type,   Override
  [ 0,      4000,  500, 'straight' ],
  [ 6000,   13000, 800, 'straight' ],
  [ 10000,  16000, 400, 'straight' ],
  [ 17800,  20000, 500, 'straight', { x: 50 } ],
  [ 18200,  20000, 500, 'straight', { x: 90 } ],
  [ 18200,  20000, 500, 'straight', { x: 10 } ],
  [ 22000,  25000, 400, 'straight', { x: 150 }],
  [ 22000,  25000, 400, 'straight', { x: 100 }]
];

var Pair = function(a,b) {
  this.x = a;
  this.y = b;
}


var playGame = function() {
  var board = new GameBoard();
  board.add(new Fondo);
  board.add(new Player);
 /* board.add(new Cliente(111,80));
  board.add(new Cliente(79,175));
  board.add(new Cliente(47,271));
  board.add(new Cliente(15,367)); */
  var n = 4;
  var array = [new Pair(111,80),new Pair(79,175),new Pair(47,271),new Pair(15,367)];
  for (i = 0; i < n; i++) {
    var par = new Pair(0,0);
    par = array[Math.floor(Math.random()*array.length)];
    var x = par.x;
    var y = par.y;
    board.add(new Spawner(new Cliente(x,y),n,8,3));
  }
  board.add(new DeadZone(340,62,5,50));      //deadzone de la mesa superior derecha(donde se dibuja el cliente)  x: +15 de la pos del player, y: -28 de la pos del player
  board.add(new DeadZone(105,62,5,50));  //  deadzone de la mesa superior izquierda(donde se dibuja el cliente)  x: -6 de la pos del cliente, y: igual que en la derecha
  board.add(new DeadZone(372,157,5,50));      //deadzone de la mesa superior derecha(donde se dibuja el cliente)  x: +15 de la pos del player, y: -28 de la pos del player
  board.add(new DeadZone(73,157,5,50));  //  deadzone de la mesa superior izquierda(donde se dibuja el cliente)  x: -6 de la pos del cliente, y: igual que en la derecha
  board.add(new DeadZone(404,253,5,50));      //deadzone de la mesa superior derecha(donde se dibuja el cliente)  x: +15 de la pos del player, y: -28 de la pos del player
  board.add(new DeadZone(41,253,5,50));  //  deadzone de la mesa superior izquierda(donde se dibuja el cliente)  x: -6 de la pos del cliente, y: igual que en la derecha
  board.add(new DeadZone(436,349,5,50));      //deadzone de la mesa superior derecha(donde se dibuja el cliente)  x: +15 de la pos del player, y: -28 de la pos del player
  board.add(new DeadZone(9,349,5,50));  //  deadzone de la mesa superior izquierda(donde se dibuja el cliente)  x: -6 de la pos del cliente, y: igual que en la derecha
  
  //board.add(new Level(level1));
  Game.setBoard(3,board);
  //Game.setBoard(5,new GamePoints(0));
};

var Fondo = function(){
  this.setup("fondo");
  this.x = 0;
  this.y = 0; 
};

Fondo.prototype = new Sprite();

Fondo.prototype.step = function(dt) {
}

var pos_player_der = [325, 357, 389, 421];
var pos_player_izq = [90, 185, 281, 377];

//Cambiar swithes
var Player = function(){
  this.setup("camarero", {reloadTime: 0.2, reloadTimeBeer: 0.4});
  this.x = 325;
  this.y = 90;
  this.reload = this.reloadTime;
  this.reloadBeer = this.reloadTimeBeer;
  this.step = function(dt) {
    
    this.reload-=dt;
    this.reloadBeer-=dt;
    if(this.reload < 0) {
      this.reload = this.reloadTime;
      if(Game.keys['abajo']) {
        if(this.x != 421){
          this.x += 32;
        }else{
         this.x = 325;
        }

        switch(this.y){
          case 90:
            this.y += 95;
          break;
          case 185:
            this.y += 96;
          break;
          case 281:
            this.y += 96;
          break;
          case 377:
            this.y = 90;
          break;
          default:


        }

      }
      else if(Game.keys['arriba']) {
        if(this.x != 325){
          this.x -= 32;
        }else{
          this.x = 421;
        }

        switch(this.y){
          case 90:
            this.y = 377;
          break;
          case 185:
            this.y -= 95;
          break;
          case 281:
            this.y -= 96;
          break;
          case 377:
            this.y -= 96;
          break;
          default:


        }
      }

         
      else if(Game.keys['espacio'] && this.reloadBeer < 0) {  //&& this.reloadBeer < 0)
         this.reloadBeer = this.reloadTimeBeer;

         this.board.add(new Beer(this.x - 10,this.y + 8));
      }   
      
    }

  };
};
    
Player.prototype = new Sprite();

// ----------------------------------------- DEAD ZONE ----------------------------------------------

var DeadZone = function(x, y, w, h){

  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;


  this.draw = function(ctx){
    ctx.fillStyle = "lightblue";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  };

};
DeadZone.prototype = new Sprite();
DeadZone.prototype.type = OBJECT_DEADZONE;

DeadZone.prototype.step = function(dt)  {
     
};


var Glass = function(x,y){
 this.setup('empty_beer',{ vx: -70});
  this.x = x;
  this.y = y;

};
Glass.prototype = new Sprite();

Glass.prototype.step = function(dt)  {
  this.x -= this.vx * dt;

  var collision = this.board.collide(this,OBJECT_DEADZONE);
  if(collision) {
    this.board.remove(this);    
  }
 
};

var Beer = function(x,y){
 this.setup('beer',{ vx: -70, reloadBeer: 0, reloadTimeBeer: 0.75});
  this.x = x;
  this.y = y;

};
Beer.prototype = new Sprite();
Beer.prototype.type = OBJECT_BEER;

Beer.prototype.step = function(dt)  {
  this.x += this.vx * dt;
  var collision = this.board.collide(this,OBJECT_CLIENTE);
  if(collision) {
    //collision.hit(this.damage);
    collision.hit();
    this.board.remove(this);
    this.board.add(new Glass(this.x, this.y));
    
  }

  var collision2 = this.board.collide(this,OBJECT_DEADZONE);
  if(collision2) {
    this.board.remove(this);    
  }
   
};

var Cliente = function(x,y){
 this.setup('cliente',{ vx: 50});
  this.x = x;
  this.y = y;

};
Cliente.prototype = new Sprite();
Cliente.prototype.type = OBJECT_CLIENTE;

Cliente.prototype.step = function(dt)  {
  this.x += this.vx * dt;

  var collision2 = this.board.collide(this,OBJECT_DEADZONE);   //si funciona
  if(collision2) {
    //collision.hit(this.damage);
    this.board.remove(this);
  }
   
};

Cliente.prototype.hit = function(dt)  {

    this.board.remove(this);
  
};



/*--------------------SPAWNER-----------------------*/
// lógica para crear clientes en una determinada barra del bar



var Spawner = function(cliente,numClientes,frecuencia,delay) {

  this.instancia = cliente;
  this.num = numClientes;
  this.freq = frecuencia;
  this.freqTime = frecuencia;
  this.delay = delay;
  
  
};
Spawner.prototype = new Sprite();

Spawner.prototype.draw = function(ctx) {}

Spawner.prototype.step = function(dt)  {

    this.delay -= dt;

    if (this.delay < 0 && this.num > 0) {

      this.freq -= dt;
      if (this.freq < 0) {
        this.freq = this.freqTime;

        var client = Object.create(this.instancia);

        this.board.add(client);
        --this.contClients;

      }
    }

}












var winGame = function() {
  Game.setBoard(3,new TitleScreen("You win!", 
                                  "Press fire to play again",
                                  playGame));
};

var loseGame = function() {
  Game.setBoard(3,new TitleScreen("You lose!", 
                                  "Press fire to play again",
                                  playGame));
};

var Starfield = function(speed,opacity,numStars,clear) {

  // Set up the offscreen canvas
  var stars = document.createElement("canvas");
  stars.width = Game.width; 
  stars.height = Game.height;
  var starCtx = stars.getContext("2d");

  var offset = 0;

  // If the clear option is set, 
  // make the background black instead of transparent
  if(clear) {
    starCtx.fillStyle = "#000";
    starCtx.fillRect(0,0,stars.width,stars.height);
  }

  // Now draw a bunch of random 2 pixel
  // rectangles onto the offscreen canvas
  starCtx.fillStyle = "#FFF";
  starCtx.globalAlpha = opacity;
  for(var i=0;i<numStars;i++) {
    starCtx.fillRect(Math.floor(Math.random()*stars.width),
                     Math.floor(Math.random()*stars.height),
                     2,
                     2);
  }

  // This method is called every frame
  // to draw the starfield onto the canvas
  this.draw = function(ctx) {
    var intOffset = Math.floor(offset);
    var remaining = stars.height - intOffset;

    // Draw the top half of the starfield
    if(intOffset > 0) {
      ctx.drawImage(stars,
                0, remaining,
                stars.width, intOffset,
                0, 0,
                stars.width, intOffset);
    }

    // Draw the bottom half of the starfield
    if(remaining > 0) {
      ctx.drawImage(stars,
              0, 0,
              stars.width, remaining,
              0, intOffset,
              stars.width, remaining);
    }
  };

  // This method is called to update
  // the starfield
  this.step = function(dt) {
    offset += dt * speed;
    offset = offset % stars.height;
  };
};

var PlayerShip = function() { 
  this.setup('ship', { vx: 0, reloadTime: 0.25, maxVel: 200 });

  this.reload = this.reloadTime;
  this.x = Game.width/2 - this.w / 2;
  this.y = Game.height - Game.playerOffset - this.h;

  this.step = function(dt) {
    if(Game.keys['left']) { this.vx = -this.maxVel; }
    else if(Game.keys['right']) { this.vx = this.maxVel; }
    else { this.vx = 0; }

    this.x += this.vx * dt;

    if(this.x < 0) { this.x = 0; }
    else if(this.x > Game.width - this.w) { 
      this.x = Game.width - this.w;
    }

    this.reload-=dt;
    if(Game.keys['fire'] && this.reload < 0) {
      Game.keys['fire'] = false;
      this.reload = this.reloadTime;

      this.board.add(new PlayerMissile(this.x,this.y+this.h/2));
      this.board.add(new PlayerMissile(this.x+this.w,this.y+this.h/2));
    }
  };
};

PlayerShip.prototype = new Sprite();
PlayerShip.prototype.type = OBJECT_PLAYER;

PlayerShip.prototype.hit = function(damage) {
  if(this.board.remove(this)) {
    loseGame();
  }
};


var PlayerMissile = function(x,y) {
  this.setup('missile',{ vy: -700, damage: 10 });
  this.x = x - this.w/2;
  this.y = y - this.h; 
};

PlayerMissile.prototype = new Sprite();
PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;

PlayerMissile.prototype.step = function(dt)  {
  this.y += this.vy * dt;
  var collision = this.board.collide(this,OBJECT_ENEMY);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  } else if(this.y < -this.h) { 
      this.board.remove(this); 
  }
};


var Enemy = function(blueprint,override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
};

Enemy.prototype = new Sprite();
Enemy.prototype.type = OBJECT_ENEMY;

Enemy.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0, 
                                   E: 0, F: 0, G: 0, H: 0,
                                   t: 0, reloadTime: 0.75, 
                                   reload: 0 };

Enemy.prototype.step = function(dt) {
  this.t += dt;

  this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
  this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);

  this.x += this.vx * dt;
   this.y += this.vy * dt;

  var collision = this.board.collide(this,OBJECT_PLAYER);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  }

  if(Math.random() < 0.01 && this.reload <= 0) {
    this.reload = this.reloadTime;
    if(this.missiles == 2) {
      this.board.add(new EnemyMissile(this.x+this.w-2,this.y+this.h));
      this.board.add(new EnemyMissile(this.x+2,this.y+this.h));
    } else {
      this.board.add(new EnemyMissile(this.x+this.w/2,this.y+this.h));
    }

  }
  this.reload-=dt;

  if(this.y > Game.height ||
     this.x < -this.w ||
     this.x > Game.width) {
       this.board.remove(this);
  }
};

Enemy.prototype.hit = function(damage) {
  this.health -= damage;
  if(this.health <=0) {
    if(this.board.remove(this)) {
      Game.points += this.points || 100;
      this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
    }
  }
};

var EnemyMissile = function(x,y) {
  this.setup('enemy_missile',{ vy: 200, damage: 10 });
  this.x = x - this.w/2;
  this.y = y;
};

EnemyMissile.prototype = new Sprite();
EnemyMissile.prototype.type = OBJECT_ENEMY_PROJECTILE;

EnemyMissile.prototype.step = function(dt)  {
  this.y += this.vy * dt;
  var collision = this.board.collide(this,OBJECT_PLAYER)
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  } else if(this.y > Game.height) {
      this.board.remove(this); 
  }
};



var Explosion = function(centerX,centerY) {
  this.setup('explosion', { frame: 0 });
  this.x = centerX - this.w/2;
  this.y = centerY - this.h/2;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function(dt) {
  this.frame++;
  if(this.frame >= 12) {
    this.board.remove(this);
  }
};

window.addEventListener("load", function() {
  Game.initialize("game",sprites,playGame);
});

