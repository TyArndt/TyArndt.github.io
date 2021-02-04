var myGamePiece;
var myBackground;

function startGame() {
    myGamePiece = new component(90, 120, "Head.png", 10, 480, "image");
    myBackground = new component(1600, 600, "BG.png", 0, 0, "background");
    MyCoords = new component("30px", "Consolas", "black", 0, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 15);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background" ) {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.gravity = 0.0;
    this.gravitySpeed = 0;
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
                if (type == "background") {
            ctx.drawImage(this.image, 
                this.x + this.width, 
                this.y,
                this.width, this.height);
        }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        MyCoords.text="Coords: " + this.y.toFixed() + " Y," + this.x.toFixed() + " X";
        if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
        }
        if(this.type == "image") {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
        this.hitTop();
        this.hitLeft();
        
        }
        
    } 
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
            clearmove()
        }
    }   

    this.hitTop = function() {
        var Top = 0 ;
        if (this.y < Top) {
            this.y = Top;
            this.speedY = 0;
            this.gravitySpeed = 0;
        }
    }

    this.hitLeft = function() {
        var Left = 0 ;
        if (this.x < Left) {
            this.x = Left;
            this.speedX = 0;
        }
    }
}

function accelerate(n) {
  myGamePiece.gravity = n;
}

function updateGameArea() {
    myGameArea.clear();
    myBackground.speedX = -1;
    myBackground.newPos();    
    myBackground.update();
    myGamePiece.newPos();    
    myGamePiece.update();
    MyCoords.update();
}

function moveup() {
    accelerate(-0.2)
}

function movedown() {
    myGamePiece.speedY = 1; 
}

function moveleft() {
    myGamePiece.speedX = -1; 
    myGamePiece.image.src = "Head-L.png";
}

function moveright() {
    myGamePiece.speedX = 1; 
    myGamePiece.image.src = "Head-R.png";
}

function clearmove() {
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
    myGamePiece.image.src = "Head.png";
}

document.onkeyup = function(e) {
    switch (e.keyCode) {
        /* case 37:
            clearmove();
            break; */
        case 38:
        accelerate(0.1)
            break;
        case 32:
        accelerate(0.1)
            
        /* case 39:
            clearmove();
            break;
        case 40:
            clearmove();
            break;
        case 65:
            clearmove();
            break;
        case 32:
        accelerate(0.1)
            clearmove();
            break;
        case 68:
            clearmove();
            break;
        case 83:
            clearmove();
            break; */
    }
};

document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37:
            moveleft();
            break;
        case 38:
            moveup();
            break;
        case 39:
            moveright();
            break;
        case 40:
            movedown();
            break;
        case 65:
            moveleft();
            break;
        case 32:
            moveup();
            break;
        case 68:
            moveright();
            break;
        case 83:
            movedown();
            break;
    }
};