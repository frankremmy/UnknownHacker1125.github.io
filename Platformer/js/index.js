
    // basic setup
document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
   // console.log(event.keyCode);
});
document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});
keys = [];
full = {
    x: window.innerWidth,
    y: window.innerHeight
}
canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
 width = canvas.width = 500;
height = canvas.height = 500;
gravity = .3;
friction = .99;



var utils = {
        norm: function(value, min, max) {
            return (value - min) / (max - min);
        },
        lerp: function(norm, min, max) {
            return (max - min) * norm + min;
        },
        map: function(value, sourceMin, sourceMax, destMin, destMax) {
            return utils.lerp(utils.norm(value, sourceMin, sourceMax),
                destMin, destMax);
        },
        clamp: function(value, min, max) {
            return Math.min(Math.max(value, Math.min(min, max)), Math.max(
                min, max));
        },
        distance: function(p0, p1) {
            var dx = p1.x - p0.x,
                dy = p1.y - p0.y;
            return Math.sqrt(dx * dx + dy * dy);
        },
        distanceXY: function(x0, y0, x1, y1) {
            var dx = x1 - x0,
                dy = y1 - y0;
            return Math.sqrt(dx * dx + dy * dy);
        },
        circleCollision: function(c0, c1) {
            return utils.distance(c0, c1) <= c0.radius + c1.radius;
        },
        circlePointCollision: function(x, y, circle) {
            return utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
        },
        pointInRect: function(x, y, rect) {
            return utils.inRange(x, rect.x, rect.x + rect.width) && utils.inRange(
                y, rect.y, rect.y + rect.height);
        },
        inRange: function(value, min, max) {
            return value >= Math.min(min, max) && value <= Math.max(min,
                max);
        },
        rangeIntersect: function(min0, max0, min1, max1) {
            return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(
                min0, max0) <= Math.max(min1, max1);
        },
        rectIntersect: function(r0, r1) {
            return utils.rangeIntersect(r0.x, r0.x + r0.w, r1.x, r1.x + r1.w) &&
                utils.rangeIntersect(r0.y, r0.y + r0.h, r1.y, r1.y + r1.h);
        },
        degreesToRads: function(degrees) {
            return degrees / 180 * Math.PI;
        },
        radsToDegrees: function(radians) {
            return radians * 180 / Math.PI;
        },
        randomRange: function(min, max) {
            return min + Math.random() * (max - min);
        },
        randomInt: function(min, max) {
            return Math.floor(min + Math.random() * (max - min + 1));
        }
    }



solides = [];
niveau =0;
points = 0;
var fps = 70;
checkPoint ={

x:10,
y:10

}

niveauxStock = [lvlinfo = {
        solides: [],
        actions: [],
    },
   lvlinfo = {
        solides: [],
        actions: [],
    },
	   lvlinfo = {
        solides: [],
        actions: [],
    },
	   lvlinfo = {
        solides: [],
        actions: [],
    },
];

function randomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}
    context.imageSmoothingEnabled = false;

function loadImage(url) {
    var img = document.createElement("img");
    img.src = url;
    return img;
}
sol = loadImage(
    "http://image.noelshack.com/fichiers/2015/40/1443815567-png.png");
grumpy = loadImage(
    "http://rack.0.mshcdn.com/media/ZgkyMDEzLzAzLzA0L2RkL3R1bWJscl9tajFjLmIwNzg2LmpwZwpwCXRodW1iCTEyMDB4OTYwMD4/d8309864/cec/tumblr_mj1c2b3jPP1qzrlhgo1_r1_1280.jpg"
);

function objets(x, y, w, h,img, line, animsprite) {
    this.gravity = .3;

	
	this.lineNum = 4;
	
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame =10;
    this.line = line;
    this.selectline = 30 * this.line;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
	
	this.w2 = 25;
    this.h2 = 30;
    this.img = img;
    this.animsprite = animsprite;
    this.speed = 3;
    this.vx = 0;
    this.vy = 0;
	
	this.direction =0;
	
	this.lastKey =40;
}



objets.prototype.draw = function() {

context.save();
context.translate(this.x+this.w2/2, this.y-10);

if(this.direction === 1){

context.scale(-1,1);

}



    context.drawImage(this.img, this.frameIndex * this.w2,30 * this.line, this.w2,
        this.h2, 0-this.w2/2, 0, this.w2, this.h2);
    //context.rect(this.x,  this.y,  this.w,  this.h)
context.restore();

	
}

objets.prototype.anim = function() {
    if (this.animsprite) {
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            // Go to the next frame
            this.frameIndex += 1;
        } else if (this.frameIndex > this.lineNum) {
            this.frameIndex = 0;
        }
    } else { 
        this.frameIndex = 0;
    }
}

objets.prototype.applyForce = function() {

if(keys[38] || keys[90] || keys[38] || keys[39]|| keys[68] || keys[37] || keys[81])
{
    this.line = 1;
    this.ticksPerFrame =5;
this.lineNum = 3;
}else{

    this.line = 0;
	    this.ticksPerFrame =10;
this.lineNum = 4;
}



    if (keys[38] || keys[90]) {
        if (!this.jumping) {
            this.jumping = true;
            this.vy = -this.speed * 2;
        }
    }
    if (keys[38]) {
        // up arrow
    }
    if (keys[39] || keys[68]) {
        // right arrow
        if (this.vx < this.speed) {
            this.vx++;
        }
		
			this.direction =1;

    }
    if (keys[37] || keys[81]) {
        // left arrow                  
        if (this.vx > -this.speed) {
            this.vx--;
        }	this.direction =0;

    }
    this.vy += this.gravity;
    this.vx *= 0.90;
    this.vy *= 0.99;
    this.x += this.vx;
    this.y += this.vy;

}

function boite(x, y, w, h, type, color) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}
boite.prototype.draw = function() {
    context.beginPath();
    context.rect(this.x, this.y, this.w, this.h);
    if (!this.color) {
        context.stroke();
    } else {
        context.fillStyle = this.color;
        context.fill();
    }
}
danger = {
    x: 130,
    y: 80,
    w: 80,
    h: 20,
}

function boiteAction(x, y, w, h, action,color,mouvement,speed,range) {
    this.action = action;
	this.color = color;
	this.show = true;
	this.mouvement = mouvement;
	this.baseX=x;
	this.baseY=y;
	
	

	this.angle = 1;
	this.range = range;
	this.speed =speed;
    this.body = {
        x: x,
        y: y,
        w: w,
        h: h,
    }



}
boiteAction.prototype.Set = function() {



context.fillStyle =this.color;
  context.fillRect(this.body.x, this.body.y, this.body.w, this.body.h);	


        if (utils.rectIntersect(player, this.body)) {

    if (this.action === "danger") {
            over = true;
			player.vy =0;
        }
		
    if (this.action === "nextlvl") {
	niveau += 1;
player.x = 10;
player.y = 10;
        }
		
    if (this.action === "addpts") {
            points += 1;
			this.show = false;
        }

		 if (this.action === "checkPoint") {


			checkPoint.x = this.body.x;
			checkPoint.y = this.body.y +this.body.h/2;
			
		 
        }
		if (this.action === "antiG" ) {

		player.vy -=player.gravity*2 ;
        }
	}


	
		if(this.mouvement === 0){
		this.body.x = this.baseX + Math.cos(this.angle) * this.range;
		this.angle += this.speed;
	
	}else if(this.mouvement === 1){
		this.body.y = this.baseY + Math.sin(this.angle) * this.range;
		this.angle += this.speed;
	}
else if(this.mouvement === 2){
		this.body.x = this.baseX + Math.cos(this.angle) * this.range;
		this.body.y = this.baseY + Math.sin(this.angle) * this.range;
		this.angle += this.speed;
	}
	
}
player = new objets(10, 50, 20, 20, loadImage("http://image.noelshack.com/fichiers/2015/42/1444690728-idl.png"), 0, true);
TITLE = true;
over = false;
niveauxStock[0].solides.push(new boite(0, 100, width, 10, "solide", "#353289"));
niveauxStock[0].solides.push(new boite(100, 70, 30, 30, "solide", "#353289"));
niveauxStock[0].solides.push(new boite(0, 0, 10, 100, "solide", "#353289"));
niveauxStock[0].actions.push(new boiteAction(130, 80, 80, 20, "danger","red"));
niveauxStock[0].actions.push(new boiteAction(350, 80, 20, 20, "nextlvl","blue"));
    for (var i = 0; i < 5; i++) {
	niveauxStock[0].actions.push(new boiteAction(120+20*i, 40-10*i, 10, 10, "addpts","yellow"));
}

niveauxStock[1].solides.push(new boite(0, 100, 100, 10, "solide", "#8dc63f"));
niveauxStock[1].solides.push(new boite(0, 0, 10, 100, "solide", "#8dc63f"));

for (var i = 0; i < 3; i++) {
niveauxStock[1].solides.push(new boite(100+30*i, 70-30*i, 30, 30, "solide", "#8dc63f"));
}
niveauxStock[1].solides.push(new boite(190, 10, 800, 10, "solide", "#8dc63f"));

 for (var i = 0; i < 5; i++) {
	niveauxStock[1].actions.push(new boiteAction(220+ 40*i, -10, 10, 10, "addpts","yellow"));
}

for (var i = 0; i < 3; i++) {
niveauxStock[1].actions.push(new boiteAction(190 + 80 * i, 0, 10, 10, "danger","red",1,0.05,50));
}

niveauxStock[1].actions.push(new boiteAction(420,-80, 10, 90, "checkPoint","pink"));

for (var i = 0; i < 3; i++) {
niveauxStock[1].actions.push(new boiteAction(550 + 80 * i, 0, 10, 10, "danger","red",2,0.05,50));
}

niveauxStock[1].actions.push(new boiteAction(850, 0, 20, 20, "nextlvl","blue"));

niveauxStock[2].solides.push(new boite(0, 100, 100, 10, "solide", "#8dc63f"));
niveauxStock[2].solides.push(new boite(0, 0, 10, 100, "solide", "#8dc63f"));

niveauxStock[2].actions.push(new boiteAction(50,0, 10, 100, "checkPoint","pink"));


niveauxStock[2].solides.push(new boite(270 , 0, 40, 200, "solide", "#8dc63f"));

niveauxStock[2].actions.push(new boiteAction(270 , -10, 40, 10, "danger","red"));



niveauxStock[2].actions.push(new boiteAction(200,0, 50, 100, "antiG","lightblue"));


niveauxStock[2].solides.push(new boite(360, -100, 10, 200, "solide", "#8dc63f"));

niveauxStock[2].actions.push(new boiteAction(350 , 0, 10, 100, "danger","red"));


niveauxStock[2].solides.push(new boite(270, 200, 800, 10, "solide", "#8dc63f"));

niveauxStock[2].actions.push(new boiteAction(0, 110, 270, 10, "danger","red"));


 for (var i = 0; i < 5; i++) {
	niveauxStock[2].actions.push(new boiteAction(120+20*i, 80-20*i, 10, 10, "addpts","yellow"));
	
}

for (var i = 0; i < 3; i++) {
niveauxStock[2].actions.push(new boiteAction(440 + 80 * i, 200, 10, 10, "danger","red",1,-0.05,100));
}
for (var i = 0; i < 3; i++) {
niveauxStock[2].actions.push(new boiteAction(400+ 80 * i, 200, 10, 10, "danger","red",1,0.05,100));
}


for (var i = 0; i < 3; i++) {
niveauxStock[2].actions.push(new boiteAction(770 + 80 * i, 200, 10, 10, "danger","red",2,-0.02,50));
}
for (var i = 0; i < 3; i++) {
niveauxStock[2].actions.push(new boiteAction(730+ 80 * i, 200, 10, 10, "danger","red",2,0.02,50));
}


niveauxStock[2].actions.push(new boiteAction(320,100, 10, 100, "checkPoint","pink"));

niveauxStock[2].solides.push(new boite(1060, 0, 10, 200, "solide", "#8dc63f"));

niveauxStock[2].actions.push(new boiteAction(1040, 180, 20, 20, "nextlvl","blue"));


niveauxStock[3].solides.push(new boite(0,100, 400, 10, "solide", "#8dc63f"));
niveauxStock[3].solides.push(new boite(0, -100, 10, 200, "solide", "#8dc63f"));

niveauxStock[3].solides.push(new boite(0, -100, 500, 10, "solide", "#8dc63f"));


niveauxStock[3].actions.push(new boiteAction(50,0, 10, 100, "checkPoint","pink"));

niveauxStock[3].actions.push(new boiteAction(100,-100, 100, 200, "antiG","lightblue"));

niveauxStock[3].actions.push(new boiteAction(280, 90, 70, 10, "danger","red"));
niveauxStock[3].actions.push(new boiteAction(110, -90, 80, 10, "danger","red"));



function loadlvl(niveau) {
    for (var i = 0; i < niveauxStock[niveau].solides.length; i++) {
        // collision Time ? :)
		
		
        colCheck(player, niveauxStock[niveau].solides[i])
            //tout ce qui bouge :D
        niveauxStock[niveau].solides[i].draw();
    }
    for (var i = 0; i < niveauxStock[niveau].actions.length; i++) {
	if(niveauxStock[niveau].actions[i].show){
	        niveauxStock[niveau].actions[i].Set();

	}
		
		
    }
}
function update() {

    setTimeout(function() { 
    context.clearRect(0, 0, width, height);

	
    context.save();
    context.scale(2, 2);
    context.translate(canvas.width / 4 - player.x, canvas.height / 4 -
        player.y + 10);
	
	
    loadlvl(niveau);        context.fillStyle = "white";
		player.draw();
		
		player.anim();
		player.applyForce();
		
    context.restore();
	
	        context.textAlign = 'left';

    context.font = "15px arial";
    context.fillText("Level " + parseInt(niveau+1), 10, 20);
	
	        context.textAlign = 'right';

    context.font = "15px arial";
    context.fillText("Points " + points, width-10, 20);
	
    if (over) {
        context.fillStyle = "black";
        context.fillRect(0, 0, width, height);
        context.textAlign = 'center';
        context.fillStyle = "white";
        context.drawImage(grumpy, 0, 0);
        context.font = "25px arial";
        context.fillText("Game over", width / 2, height / 2 + 140);
        context.font = "20px arial";
        context.fillText("Press 'R' to restart", width / 2,
            height / 2 + 180);
        if (keys[82]) {
            over = false;			player.vy =0;

			player.x = checkPoint.x;
			player.y = checkPoint.y;
			
        }
    }
    if (TITLE) {
        context.fillStyle = "black";
        context.fillRect(0, 0, width, height);
        context.textAlign = 'center';
        context.fillStyle = "white";
        context.font = "50px arial";
        context.fillText("Title screen", width / 2, height / 2);
        context.font = "20px arial";
			player.x = checkPoint.x;
			player.y = checkPoint.y;
			player.vy =0;

			context.fillText("Press ' Space' to start", width / 2,
            height / 2 + 180);
        if (keys[32]) {
            TITLE = false;
			
        }
    }
    requestAnimationFrame(update);
	   }, 1000 / fps);
}
update();

function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.w / 2)) - (shapeB.x + (shapeB.w / 2)),
        vY = (shapeA.y + (shapeA.h / 2)) - (shapeB.y + (shapeB.h / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.w / 2) + (shapeB.w / 2),
        hHeights = (shapeA.h / 2) + (shapeB.h / 2),
        colDir = null;
    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
                shapeA.vy *= -.2;
            } else {
                colDir = "b";
                shapeA.y -= oY;
                if (shapeB.type === "trampo") {
                    shapeA.vy *= -6;
                    shapeA.jumping = true;
                } else {
                    shapeA.jumping = false;
                    shapeA.vy *= -.6;
                    //shapeA.vy = 0;
                    shapeA.y = shapeB.y - shapeA.h;
                }
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
                shapeA.vx *= -.98;
            } else {
                colDir = "r";
                shapeA.x -= oX;
                shapeA.vx *= -.98;
            }
        }
    }
    return colDir;
}