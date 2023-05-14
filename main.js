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
    var towerHole = 160;
    var towerGroup;
    var beerGroup;
    var localStorageName = 'HoldenHighScore';
    var score = 0;
    


    var play = function(game) {};

    play.prototype = {
        preload:function(){
            //Load Images
            game.load.image("holden", "Head.png");
            game.load.image("tower", "Tower.png");
            game.load.image("bg", "BG.png");
            game.load.image("beer", "beer.png");
        },
        create:function(){

            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.setScreenSize(true);
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.refresh();

            //Add Backgrounds
            bg = game.add.image(0,0,"bg");
            bg1 = game.add.image(1600,0,"bg");

            //Create Groups
            towerGroup = game.add.group();
            beerGroup = game.add.group();
            beerGroup.enableBody = true;

            //Init Game Settings
            game.stage.backgroundColor = "#87CEEB";
            game.stage.disableVisibilityChange = true;
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //Add The Holden
            holden = game.add.sprite(80,240,"holden");
            holden.scale.setTo(0.15);
            holden.anchor.set(0.5);
            game.physics.arcade.enable(holden);
            holden.body.gravity.y = gravity;

            //Actions
            game.input.onDown.add(jump, this);
            SPACEBAR = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            CONTROLKEY = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
            CONTROLKEY.onDown.add(pause,self);
            SPACEBAR.onDown.add(jump,this);
            game.time.events.loop(towerInterval, addtower); 
            addtower();           
         
        function pause(){
                if(game.paused == false ){
                    game.paused = true}
                    else{ game.paused = false}
                }

        //Create Score
        score = 0
        scoreText = this.add.text(10, 10, '', { font: '20px Arial', fill: '#fff' });
        updateScore(score);

        //Create Top Score
        topScore = localStorage.getItem(localStorageName) == null ? 0 : localStorage.getItem(localStorageName);
        
        //topScore = 0
        topScoreText = this.add.text(10, 35, '', { font: '20px Arial', fill: '#fff' });
        updateTopScore(topScore);       
    },
        
        update:function(){
            //Scroll Background image
            bg.x += -0.5;
            if(bg.x <= -1600 ) {
                bg.x = 0;
                bg1.x = 1600;
            }
            bg1.x += -0.5;
           
           //Physics
            game.physics.arcade.collide(holden, towerGroup, die);
            game.physics.arcade.overlap(holden, beerGroup, function(holden,beer){
                beerGroup.remove(beer);
                updateScore(1);
            });

            speed = speed + (score * .02 )


            //Die if you fall off screen
            if(holden.y>game.height){
                die();
            }	
        }
    };

    game.state.add("Play",play);
    game.state.start("Play");

    //Jump
    function jump(){
        holden.body.velocity.y = -thrust;	
    };

    //Add Points
    function updateScore(inc){
        score += inc;
        scoreText.text = 'Score: ' + score;
    };

    function updateTopScore(newTopScore){
        topScoreText.text = 'Best: ' + newTopScore;
    }

    //Add Tower
    function addtower(){
        var towerHolePosition = game.rnd.between(50,430-towerHole);
        var uppertower = new tower(game,320,towerHolePosition-480,-speed);
        game.add.existing(uppertower);
        towerGroup.add(uppertower);
        var lowertower = new tower(game,320,towerHolePosition+towerHole,-speed);
        game.add.existing(lowertower);
        towerGroup.add(lowertower);
        var beerme = new beer(game,345,towerHolePosition+50,-speed);
        game.add.existing(beerme);
        beerGroup.add(beerme);
    };

    function die(){
        updateTopScore(score);
        localStorage.setItem(localStorageName, Math.max(score, topScore));
        game.state.start("Play");	
        speed = 120
    };


    tower = function (game, x, y, speed) {
        Phaser.Sprite.call(this, game, x, y, "tower");
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.velocity.x = speed;
    };

    beer = function (game, x, y, speed) {
        Phaser.Sprite.call(this, game, x, y, "beer");
        this.enableBody= false;
        game.physics.enable(this);
        this.body.velocity.x = speed;
        
    };

    beer.prototype = Object.create(Phaser.Sprite.prototype);
    beer.prototype.constructor = beer;

    tower.prototype = Object.create(Phaser.Sprite.prototype);
    tower.prototype.constructor = tower;
};