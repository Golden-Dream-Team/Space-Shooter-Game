var game = new Game(); //primary game instance


function Bullet(object) {
    this.alive = false; // Is true if the bullet is currently in use
    var self = object;
    var type="bullet";
    var isColliding = false;
    /*
     * Sets the bullet values
    */

    this.spawn = function(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.alive = true;
    };

    this.init=function(images,x,y){
        this.sprite=new Kinetic.Image({
            image:images.image.blueWpn,
            x:this.x,
            y:this.y,
            width:10,
            height:10
        });
    }

    this.clear = function() {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.alive = false;
    };

}

    function Pool(maxSize) {
        var size = maxSize; // Max bullets allowed in the pool
        var pool = [];

        this.spawn = function(x, y, speed) {
            this.x = x;
            this.y = y;
            this.speed = speed;
            this.alive = true;
        };
        this.getPool = function () {
            var obj = [];
            for (var i = 0; i < size; i++) {
                if (pool[i].alive) {
                    obj.push(pool[i]);
                }
            }
            return obj;
        };


        this.init=function(object){
            if(object=="blueWpn"){
                for(var i=0; i<size;i+=1){
                    var bullet=new Bullet("blueWpn");
                    bullet.init(images.image.blueWpn,0,0);
                    bullet.type="bullet";
                    pool[i]=bullet;
                }
            } else if(object=="enemy"){
                for(var i=0;i<size;i+=1){
                    var enemy=new Enemy();
                    enemy.init(images.image.enemy,0,0);
                    pool[i]=enemy;
                }
            } else if(object=="redWpn"){
                for(var i=0;i<size;i+=1){
                    var enemyBullet=new Bullet("blueWpn");
                    enemyBullet.init(images.image.blueWpn,0,0);
                    enemyBullet.type="bullet";
                    pool[i]=enemyBullet;
                }
            }
        };

        /*
         * Populates the pool array with the given object
         */

        /*
         * Grabs the last item in the list and initializes it and
         * pushes it to the front of the array.
         */
        this.get = function (x, y, speed) {
            if (!pool[size - 1].alive) {
                pool[size - 1].spawn(x, y, speed);
                pool.unshift(pool.pop());
            }
        };
        
        /*
         * Draws any in use Bullets. If a bullet goes off the screen,
         * clears it and pushes it to the front of the array.
         */
        this.animate = function () {
        };
    }

    function Ship() {
        this.speed = 3;
        this.bulletPool = new Pool(30);
        var fireRate = 15;
        var counter = 0;
        this.collidableWith = "redWpn";
        this.type="ship";
        this.up = false;
        this.left = false;
        this.down = false;
        this.right = false;

        this.init = function (images) {
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

        this.move = function () {
            if (this.right && this.sprite.getX() < 340) {
                this.sprite.setX(this.sprite.getX() + this.speed);
            }
            if (this.left && this.sprite.getX() > 5) {
                this.sprite.setX(this.sprite.getX() - this.speed);
            }
            if (this.up && this.sprite.getY() > 5) {
                this.sprite.setY(this.sprite.getY() - this.speed);
            }
            if (this.down && this.sprite.getY() < 540) {
                this.sprite.setY(this.sprite.getY() + this.speed);
            }
        };

        this.fire = function () {
            game.shipPool.get(this.x+6, this.y, 3);

        };
    }

    function Enemy() {
        //var percentFire = 0.01;
        var chance = 0;
        this.speed=3;
        this.alive = false;
        this.bulletPool = new Pool(30);
        this.collidableWith = "blueWpn";
        this.up = false;
        this.left = false;
        this.down = false;
        this.right = false;
        this.type = "enemy";

        /*
         * Move the enemy
         */
        this.init = function (images,x,y) {
            // Defualt variables
            this.sprite = new Kinetic.Image({
                image: images.enemy,
                x: this.x,
                y: this.y,
                width: 50,
                height: 50
            });
            this.alive = true;
            this.isColliding = false;
            //this.bulletPool.init("blueWpn");
        };

        this.move = function () {
            if (this.right && this.sprite.getX() < 340) {
                this.sprite.setX(this.sprite.getX() + this.speed);
            }
            if (this.left && this.sprite.getX() > 10) {
                this.sprite.setX(this.sprite.getX() - this.speed);
            }
            if (this.up && this.sprite.getY() > 10) {
                this.sprite.setY(this.sprite.getY() - this.speed);
            }
            if (this.down && this.sprite.getY() < 540) {
                this.sprite.setY(this.sprite.getY() + this.speed);
            }
        };

        /*
         * Fires a bullet
         */
        this.fire = function () {
            game.enemyPool.get(this.x+this.width/2, this.y+this.height, -2.5);
        };

        /*
         * Resets the enemy values
         */
        this.clear = function () {
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
            enemy: 'Resources/player2.png',
            blueWpn: 'Resources/blueWeapon.png',
            redWpn: 'Resources/redWeapon.png'
        };
        var background;
        var stage;
        var shipLayer;
        var backlayer;
        var enemyLayer;
        var enemyPool=new Pool(50);
        enemyPool.init("bullet");
        var shipPool=new Pool(30);
        shipPool.init("bullet");
        this.ship = new Ship();
        this.enemy=new Enemy();

        this.init = function () {
            var loadedImages = 0;
            var numImages = 0;
            for (var src in sources) {
                numImages++;
            }
            for (var src in sources) {
                images[src] = new Image();
                images[src].onload = function () {
                    if (++loadedImages >= numImages) {
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



            this.ship.init(images);
            this.enemy.init(images);

            background = new Kinetic.Image({
                image: images.bg,
                x: 0,
                y: -9800,
                width: 400,
                height: 10527
            });
            backlayer.add(background);
            shipLayer.add(this.ship.sprite);
            shipLayer.add(this.enemy.sprite);
            stage.add(backlayer);
            stage.add(shipLayer);
            stage.draw();
        };

        this.moveBackground = function () {
            if (background.getY() > 0) {
                background.setY(9600);
            }
            background.setY(background.getY() + 1);
            backlayer.draw();
        };

        this.moveship = function () {
            this.ship.move();
            shipLayer.draw();
        };

        this.moveenemy= function() {
            this.enemy.move();
            shipLayer.draw();
        };



        // Start the animation loop
        this.start = function () {
            animate();
        };

        // Restart the game
        this.restart = function () {
        };

        // Game over
        this.gameOver = function () {
        };
    }

    function animate() {
        game.moveBackground();
        game.moveship();
        game.moveenemy();
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

    document.onkeydown = function (e) {
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
        } else if (keyCode == 32) {
            game.ship.fire();
        }
    };

    document.onkeyup = function (e) {
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
        } else if (keyCode == 32) {
            game.ship.fire();
        }
    };
    document.body.onkeydown=function(e) {
        var keyCode= e.keyCode;
        if(keyCode==38) {
            game.enemy.up=true;
        } else if(keyCode==40){
            game.enemy.down=true;
        } else if(keyCode==37){
            game.enemy.left=true;
        } else if(keyCode==39) {
            game.enemy.right=true;
        }
    };
    document.body.onkeyup=function(e) {
        var keyCode= e.keyCode;
        if(keyCode==38) {
            game.enemy.up=false;
        } else if(keyCode==40){
            game.enemy.down=false;
        } else if(keyCode==37){
            game.enemy.left=false;
        } else if(keyCode==39) {
            game.enemy.right=false;
        }
    };
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    window.onload = function () {
        game.init();
        game.start();
    };
