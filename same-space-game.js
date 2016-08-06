
var game = new Game(); //primary game instance

function Bullet(object) {

}

function QuadTree(boundBox, lvl) {

}

    this.getAllObjects = function(returnedObjects) {
        return returnedObjects;
    };

    /*
     * Return all objects that the object could collide with
     */
    this.findObjects = function(returnedObjects, obj) {
        return returnedObjects;
    };

    /*
     * Insert the object into the quadTree. If the tree
     * excedes the capacity, it will split and add all
     * objects to their corresponding nodes.
     */
    this.insert = function(obj) {
    };

    /*
     * Determine which node the object belongs to. -1 means
     * object cannot completely fit within a node and is part
     * of the current node
     */
    this.getIndex = function(obj) {
        return index;
    };

    /*
     * Splits the node into 4 subnodes
     */
    this.split = function() {
    };

function Pool(maxSize) {
    var size = maxSize; // Max bullets allowed in the pool
    var pool = [];

    this.getPool = function() {
        return obj;
    };


    /*
     * Populates the pool array with the given object
     */
    this.init = function(object) {
    };

    /*
     * Grabs the last item in the list and initializes it and
     * pushes it to the front of the array.
     */
    this.get = function(x, y, speed) {
    };

    /*
     * Used for the ship to be able to get two bullets at once. If
     * only the get() function is used twice, the ship is able to
     * fire and only have 1 bullet spawn instead of 2.
     */
    this.getTwo = function(x1, y1, speed1, x2, y2, speed2) {
    };

    /*
     * Draws any in use Bullets. If a bullet goes off the screen,
     * clears it and pushes it to the front of the array.
     */
    this.animate = function() {
    };
}

function Ship() {
    this.speed = 3;
    this.bulletPool = new Pool(30);
    var fireRate = 15;
    var counter = 0;
    this.collidableWith = "enemyBullet";
    this.up = false;
    this.left = false;
    this.down = false;
    this.right = false;

    this.init = function(images) {
        // Defualt variables
        this.sprite = new Kinetic.Image({
          image: images.ship,
          x: 175,
          y: 520,
          width: 50,
          height: 50
        });
        this.alive = true;
        this.isColliding = false;
        this.bulletPool.init("bullet");
    };

    this.move = function() {
      if (this.right && this.sprite.getX() < 350) {
        this.sprite.setX(this.sprite.getX() + this.speed);
      }
      if (this.left && this.sprite.getX() > 10){
        this.sprite.setX(this.sprite.getX() - this.speed);
      }
      if (this.up && this.sprite.getY() > 10) {
        this.sprite.setY(this.sprite.getY() - this.speed);
      }
      if (this.down && this.sprite.getY() < 530) {
        this.sprite.setY(this.sprite.getY() + this.speed);
      }
    };

    this.fire = function() {
    };
}

function Enemy() {
    //var percentFire = 0.01;
    var chance = 0;
    this.alive = false;
    this.collidableWith = "bullet";
    this.type = "enemy";

    /*
     * Sets the Enemy values
     */
    this.spawn = function(x, y, speed) {
    };

    /*
     * Move the enemy
     */
    this.draw = function() {
    };

    /*
     * Fires a bullet
     */
    this.fire = function() {
    };

    /*
     * Resets the enemy values
     */
    this.clear = function() {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.alive = false;
        this.isColliding = false;
    };
}

function Game() {

  var images = {}; // texture container

  var sources = {
              bg: 'Resources/starBackground.png',
              ship: 'Resources/ship.png',
              blueWpn: 'Resources/blueWeapon.png',
              redWpn: 'Resources/redWeapon.png'
            };
  var background;
  var stage;
  var shipLayer;
  var backlayer;
  this.ship = new Ship();

  this.init = function() {
    var loadedImages = 0;
    var numImages = 0;
    for(var src in sources) {
      numImages++;
    }
    for(var src in sources) {
      images[src] = new Image();
      images[src].onload = function() {
        if(++loadedImages >= numImages) {
        }
      };
      images[src].src = sources[src];
    }

      stage = new Kinetic.Stage({
                container: 'game-container',
                width: 400,
                height: 600
              });

      shipLayer = new Kinetic.Layer();
      backlayer = new Kinetic.Layer();
      stage.add(backlayer);
      stage.add(shipLayer);

      this.ship.init(images);

      background = new Kinetic.Image({
        image: images.bg,
        x: 0,
        y: -9800,
        width: 400,
        height: 10527
      });
      backlayer.add(background);
      shipLayer.add(this.ship.sprite);
      stage.draw();
      };

    this.moveBackground = function() {
      if (background.getY() > 0) {
        background.setY(9600);
      }
      background.setY(background.getY() + 1);
      backlayer.draw();
    };

    this.moveship = function() {
      this.ship.move();
      shipLayer.draw();
    }

    // Spawn a new wave of enemies
    this.spawnWave = function() {
    };

    // Start the animation loop
    this.start = function() {
      animate();
    };

    // Restart the game
    this.restart = function() {
    };

    // Game over
    this.gameOver = function() {
    };
}

function animate() {
   game.moveBackground();
   game.moveship();
   window.requestAnimationFrame(animate);
}

//pass Kinetic.Image type objects
function detectCollision(objectA, objectB) {
  if (objectA.x < objectB.x + objectB.width &&
   objectA.x + objectA.width > objectB.x &&
   objectA.y < objectB.y + objectB.height &&
   objectA.height + objectA.y > objectB.y) {
     return true;
   } else {
     return false;
   }
}

document.onkeydown = function(e) {
  var keyCode = e.keyCode;

  if (keyCode == 87) { //w
    game.ship.up = true;
    game.ship.down = false;
  }
  else if (keyCode == 65) { //a
    game.ship.left = true;
    game.ship.right = false;
  }
  else if (keyCode == 83) { //s
    game.ship.down = true;
    game.ship.up = false;

  }
  else if (keyCode == 68) { //d
    game.ship.right = true;
    game.ship.left = false;
  }
};

document.onkeyup = function(e) {
  var keyCode = e.keyCode;

  if (keyCode == 87) { //w
    game.ship.up = false;
  }
  else if (keyCode == 65) { //a
    game.ship.left = false;
  }
  else if (keyCode == 83) { //s
    game.ship.down = false;
  }
  else if (keyCode == 68) { //d
    game.ship.right = false;
  }
};

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.onload = function() {
  game.init();
  game.start();
};
