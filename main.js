window.onload = function() {
    var game = new Phaser.Game(320, 480, Phaser.CANVAS);
    var holden;
    var bg;
    var gravity = 800;
    var speed = 125;
    var thrust = 300;
    var tower = 300;
    var beer = 300;
    var towerInterval = 2000;
    var towerHole = 120;
    var towerGroup;
    var beerGroup;

    var play = function(game) {};

    play.prototype = {
        preload:function(){
            game.load.image("holden", "Head.png");
            game.load.image("tower", "Tower.png");
            game.load.image("bg", "BG.png");
            game.load.image("beer", "beer.png");
        },
        create:function(){
            bg = game.add.image(0,0,"bg");
            bg1 = game.add.image(1600,0,"bg");
            towerGroup = game.add.group();
            beerGroup = game.add.group();
            beerGroup.enableBody = true;
            game.stage.backgroundColor = "#87CEEB";
            game.stage.disableVisibilityChange = true;
            game.physics.startSystem(Phaser.Physics.ARCADE);
            holden = game.add.sprite(80,240,"holden");
            holden.scale.setTo(0.15);
            holden.anchor.set(0.5);
            game.physics.arcade.enable(holden);
            holden.body.gravity.y = gravity;
            game.input.onDown.add(jump, this);
            game.time.events.loop(towerInterval, addtower); 
            addtower();
            pause_label = game.add.text( 250, 450, 'Pause', { font: '20px Arial', fill: '#fff' });
            pause_label.inputEnabled = true;
            pause_label.events.onInputUp.add(function () {
                game.paused = true;            
            });

            game.input.onDown.add(unpause, self);
            function unpause(event){
                if(game.paused){
                    game.paused = false;
            }
        }
        },
        
        update:function(){
            
            bg.x += -0.5;
            if(bg.x <= -1600 ) {
                bg.x = 0;
                bg1.x = 1600;
            }
            
            bg1.x += -0.5;
           
            game.physics.arcade.collide(holden, towerGroup, die);
            //game.physics.arcade.collide(holden, beerGroup, drinkbeer(beerGroup));

            //if (game.physics.arcade.overlap(holden, this.beer ,drinkBeer, null, this))
            
            if(holden.y>game.height){
                die();
            }	
        }
    };

    game.state.add("Play",play);
    game.state.start("Play");

    function jump(){
        holden.body.velocity.y = -thrust;	
    }

    function addtower(){
        var towerHolePosition = game.rnd.between(50,430-towerHole);
        var uppertower = new tower(game,320,towerHolePosition-480,-speed);
        game.add.existing(uppertower);
        towerGroup.add(uppertower);
        var lowertower = new tower(game,320,towerHolePosition+towerHole,-speed);
        game.add.existing(lowertower);
        towerGroup.add(lowertower);
        var beerme = new beer(game,335,towerHolePosition+50,-speed);
        game.add.existing(beerme);
        beerGroup.add(beerme);
    }

    function die(){
        game.state.start("Play");	
    }

    function drinkBeer(holden, beerGroup){
        beer.disableBody(true, true);
    }


    tower = function (game, x, y, speed) {
        Phaser.Sprite.call(this, game, x, y, "tower");
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.velocity.x = speed;
    };

    beer = function (game, x, y, speed) {
        Phaser.Sprite.call(this, game, x, y, "beer");
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.velocity.x = speed;
    };

    beer.prototype = Object.create(Phaser.Sprite.prototype);
    beer.prototype.constructor = beer;

    beer.prototype.update = function() {
        if(this.x+this.width<holden.x){

        }
        if(this.x<-this.width){
            
        }
    };	


    tower.prototype = Object.create(Phaser.Sprite.prototype);
    tower.prototype.constructor = tower;

    tower.prototype.update = function() {
        if(this.x+this.width<holden.x){

        }
        if(this.x<-this.width){
            this.destroy();
        }
    };	
};