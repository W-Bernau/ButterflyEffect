

var viewWidth = window.innerWidth,
    viewHeight = window.innerHeight,
    drawingCanvas = document.getElementById("drawing_canvas"),
    ctx,
    timeStep = (12/60),
    veloX = 1,
    veloY = 1,
    speedx=0,
    speedy=0,
    sign= 0,
    xVal = 45,
    yVal = 45,
    time = 0;

// physics

var mathTimeScale = 50,
    initialAngle = 45,
    initialAngleRad = (-initialAngle*Math.PI)/180;

// graphics
var circ1, 
    initPosX = window.outerWidth*((xVal)/100),
    initPosY = window.outerHeight*((yVal)/100),
    trail1;

function initDrawingCanvas() {
    drawingCanvas.width = viewWidth;
    drawingCanvas.height = viewHeight;
    ctx = drawingCanvas.getContext('2d');
}

function initGraphics() {
    // math
    var dt = timeStep * mathTimeScale;
    circ1 = {x: initPosX, y: initPosY, radius: 10};
    trail1 = [];
   
}


function update() {
    // MATH
    var dt = timeStep * mathTimeScale;
    circ1.x += ((Math.cos(initialAngleRad))*veloX)*dt;
    circ1.y += ((Math.sin(initialAngleRad))*veloY)*dt;
    
    if(circ1.x >= viewWidth*.6){
        veloX = veloX * -1;
    }
    if(circ1.x <= viewWidth*.3){
        veloX = veloX * -1;
    }
    if(circ1.y >= viewHeight*.6){
        veloY = veloY * -1;
    }
    if(circ1.y <= viewHeight*.32){
        veloY = veloY * -1;
    }
    trail1.unshift({x:circ1.x, y:circ1.y});
    
}

function drawTrail(n) {
    ctx.beginPath();
    ctx.moveTo((n[0]).x, (n[0]).y);

    for (var i = 1; i < n.length; i++) {
        ctx.lineTo(n[i].x, n[i].y);
    }

    ctx.stroke();
}

function draw() {
    // clear
    ctx.clearRect(0, 0, viewWidth, viewHeight);
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.fill();

    //Drawing Table
    ctx.beginPath();
    ctx.lineWidth = "8";
    ctx.rect(innerWidth*.29, innerHeight*.313, innerWidth*.317, innerHeight*.299);
    ctx.stroke();
    // MATH
    ctx.globalCompositeOperation = 'destination-over';

    ctx.strokeStyle = '#800';
        ctx.lineWidth = "2";
        drawTrail(trail1);
    ctx.fillStyle = '#800';
    ctx.globalCompositeOperation = 'source-over';
        drawCircle(circ1);
        
    ctx.restore();
}


function drawCircle(c) {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, 2 * Math.PI, false);
    ctx.fill();
}



function loop() {
    
    update();
    draw();
    time += timeStep;
    requestAnimationFrame(loop);
}


window.onload = function() {
    initDrawingCanvas();
    initGraphics();
    requestAnimationFrame(loop);
};


document.getElementById("startStop").onclick = function() {
        timeStep = 0;
  };      
document.getElementById("stopStart").onclick = function() {
    timeStep = (12/60);
};
document.getElementById("xRange").oninput = function(){
    console.log(this.value)
    initPosX = window.outerWidth*.45*((this.value)/100);
    mathTimeScale = 50;
    initialAngle = initialAngle;
    initGraphics();
};
document.getElementById("yRange").oninput = function(){
    yVal = this.value
    initPosY = window.outerHeight*.45*((yVal)/100);
    mathTimeScale = 50;
    initialAngle = initialAngle;
    initGraphics();
};
  



// GUI

var settings = {
    mathTimeScale: 50,
    initialAngle: 45,
    positionX: 0,
    xVal: 45,
    yVal: 45,

    apply:function() {


      //  mass1 = this.mass1;
      //  mass2 = this.mass2;
        mathTimeScale = this.mathTimeScale;
        initialAngle = this.initialAngle;
        xVal = this.xVal;
        yVal = this.yVal;
        initialAngleRad = (this.initialAngle*Math.PI)/180;
        initGraphics();
    }
};

let gui = new dat.GUI();



gui.add(settings, 'mathTimeScale', 50, 100);
gui.add(settings, 'initialAngle', 0, 360);
gui.add(settings, 'xVal', 0, 100);
gui.add(settings, 'yVal', 0, 100);
gui.add(settings, 'apply');

gui.close();



