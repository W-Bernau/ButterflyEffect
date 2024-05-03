
"use strict";
/*
	Inspired by:
	https://en.wikipedia.org/wiki/Lorenz_system#Lorenz_attractor
	https://youtu.be/f0lkz2gSsIk  (The Coding Train)
	http://highfellow.github.io/lorenz-attractor/attractor.html
*/

// Lorenz system variables
var nPoints = 2000; // number of points.

var sigma = 10;
var rho = 28;
var beta = 8.0/3.0;

var dt = 0.01;

var x = 0.01;
var y = 0.0;
var z = 0.0;
	
// Plot dimensions 
var curveWidth = 3;
var scale = 6; // a scale factor
var axesSize = 200;

// Initial rotation angles [rad]
var rotx = 300 * Math.PI/180;
var roty = 25 * Math.PI/180;
var rotz = 0 * Math.PI/180;

var nodes =[];
var nodesNoTransform =[];
var nodesAxes =[];
var color;
var counter = 0;
var requestFrame = null;
var cont = document.getElementById('container');
// Obtain a reference to the canvas element.
var canvas  = document.getElementById("myCanvas");
// Obtain a 2D context from the canvas element.
var cxt = canvas.getContext("2d");
	
// *** Mouse rotate. ***	
var mouseX = 0, mouseY = 0, pmouseX, pmouseY; // mouseX is current mouse x-coordinate, pmouseX is previous mouse x-coordinate when it was 1 pixel different.  
// Figure must rotate iff mousemove AND mousedown (for mouse devices):
var mouseDown = false;
cont.addEventListener("mousedown", handleMousedown, false);	
cont.addEventListener("touchstart", handleMousedown, false);	
document.addEventListener("mouseup", function (e) { if(mouseDown) mouseDown = false; canvas.style.cursor = "grab"; }, false);	
cont.addEventListener("mousemove", handleMove, false);
cont.addEventListener("touchmove", handleMove, false);		

function handleMousedown(e) {
	if(!mouseDown) mouseDown = true;
	canvas.style.cursor = "grabbing";
	var x = parseInt(e.pageX) || parseInt(e.changedTouches[0].pageX);
	var y = parseInt(e.pageY) || parseInt(e.changedTouches[0].pageY);
	mouseX = x;
	mouseY = y;
	e.preventDefault();
};
  
function handleMove(e) {
	var sensetivity = 100; // how sensitive the mouse should be

	// getting mouseX, mouseY, pmouseX and pmouseY.	
	pmouseX = mouseX;
	pmouseY = mouseY;
	var x = parseInt(e.pageX) || parseInt(e.changedTouches[0].pageX);
	var y = parseInt(e.pageY) || parseInt(e.changedTouches[0].pageY);	
	if (Math.abs(x - pmouseX) >= 1) {mouseX = x;} else { mouseX = pmouseX }
	if (Math.abs(y - pmouseY) >= 1) {mouseY = y;} else { mouseY = pmouseY }	

	// change rotation
	//if(e.which==1 || e.buttons==1) {
	if(mouseDown === true) {
		rotx = rotx + (mouseY - pmouseY)/sensetivity;
		roty = roty + (mouseX - pmouseX)/sensetivity;
		start();
	}
	e.preventDefault();
};
// *** END Mouse rotate. ***

// Controls
var autoRotation = document.getElementById("autoRotation");
var isAutoRotation = true;
autoRotation.addEventListener("click", handleAutoRotation, false);
function handleAutoRotation() {
	if (autoRotation.checked) {
		isAutoRotation = true;
	} else { isAutoRotation = false; }
}
handleAutoRotation();
var xyz = document.getElementById("xyz");
var isXyz = false;
xyz.addEventListener("click", handleXyx, false);
function handleXyx() {
	if (xyz.checked) {
		isXyz = true;
	} else { isXyz = false; }
};
handleXyx();

// start animation
function start() {
	if (requestFrame) {
		cancelAnimationFrame(requestFrame);
		requestFrame = null;
	}
	requestFrame = requestAnimationFrame(drawFunction);
};
initial();

window.addEventListener("resize", initial);

function initial() {
	sizeCanvas();
	start();
};

function sizeCanvas() {	
	/// Make size of canvas equal to size container and move canvas to center
	var cs = getComputedStyle(cont);
	/// these will return dimensions in *pixel* regardless of what
	/// you originally specified for container:
	canvas.width = parseInt(cs.getPropertyValue('width'), 10);
	canvas.height = parseInt(cs.getPropertyValue('height'), 10);
	cxt.translate(canvas.width/2, canvas.height/2);
	// *** Draw graphics. ***
	cxt.strokeStyle = "white";
	cxt.lineWidth = curveWidth;
	cxt.lineCap = "round";
	cxt.lineJoin = "round";
	cxt.font = 'normal 16px Arial';	
};	

function drawFunction() {	
	cxt.clearRect(-canvas.width, -canvas.height, 2*canvas.width, 2*canvas.height);

	var dx = ( sigma * (y-x) ) * dt;
	var dy = ( x * (rho-z) - y ) * dt;
	var dz = ( x*y - beta*z ) * dt;
	
	x = x + dx;
	y = y + dy;
	z = z + dz;
	
	color = "hsl(" + (counter/10)%360 + ", 100%, 50%)";
	
	nodesNoTransform[counter] = { x:x, y:y, z:z, color:color };
	nodes = [];
	// 'nodesNoTransform' contains ALL calculated function points, 'nodes' contains only the 'nPoints' function points to be plotted each time frame.
	if(nodesNoTransform.length > nPoints) {
		for ( var i = 0; i < nPoints; i++) {
			//nodes[i] = nodesNoTransform[counter-i]; // References of object elements of the array are copied as well!  
			//nodes = nodesNoTransform.slice(-nPoints); // References of object elements of the array are copied as well!
			nodes[i] = { x:nodesNoTransform[counter-i].x, y:nodesNoTransform[counter-i].y, z:nodesNoTransform[counter-i].z, color:nodesNoTransform[counter-i].color };
		}				
	} else {	
		for ( var i = 0; i < nodesNoTransform.length; i++) {
			nodes[i] = { x:nodesNoTransform[counter-i].x, y:nodesNoTransform[counter-i].y, z:nodesNoTransform[counter-i].z, color:nodesNoTransform[counter-i].color };
		}	
	}	

	// Axes nodes
	if (isXyz) {	
		nodesAxes[0] = {x:0, y:0, z:0};
		nodesAxes[1] = {x:axesSize/scale, y:0, z:0};
		nodesAxes[2] = {x:0, y:axesSize/scale, z:0};
		nodesAxes[3] = {x:0, y:0, z:axesSize/scale};
	}
	
	// rotate the nodes
	if (isAutoRotation) {
		rotateX3D(rotx += 0.001);	
		rotateY3D(roty += 0.005);
		rotateZ3D(rotz += 0);
	} else {
		rotateX3D(rotx);	
		rotateY3D(roty);
		rotateZ3D(rotz);	
	}
	
	// draw function 
	// sort the nodes by their z value so that the "deepest" nodes are drawn first and those closest to the viewer are drawn last. 
	//nodes.sort(function(a, b){return a.z-b.z});		
	for (var i=1; i < nodes.length; i++) {
		//cxt.fillStyle = nodes[i].color;
		//cxt.fillRect(nodes[i].x*scale, nodes[i].y*scale,curveWidth,curveWidth);		
		cxt.strokeStyle = nodes[i-1].color;		
		cxt.beginPath();	
		cxt.moveTo(nodes[i-1].x*scale, nodes[i-1].y*scale);		
		cxt.lineTo(nodes[i].x*scale, nodes[i].y*scale);
		cxt.stroke();		
	}
	counter++;
	
	// draw axes
	if (isXyz) {
		cxt.lineWidth = 1;	
		cxt.fillStyle = "white";
		cxt.strokeStyle = "white";
		cxt.beginPath();
		cxt.moveTo(nodesAxes[0].x*scale,nodesAxes[0].y*scale);
		cxt.lineTo(nodesAxes[1].x*scale,nodesAxes[1].y*scale);
		cxt.stroke();      
		cxt.fillText('y',nodesAxes[1].x*scale,nodesAxes[1].y*scale);	
		cxt.beginPath();
		cxt.moveTo(nodesAxes[0].x*scale,nodesAxes[0].y*scale);
		cxt.lineTo(nodesAxes[2].x*scale,nodesAxes[2].y*scale);
		cxt.stroke();
		cxt.fillText('x',nodesAxes[2].x*scale,nodesAxes[2].y*scale);		
		cxt.beginPath();
		cxt.moveTo(nodesAxes[0].x*scale,nodesAxes[0].y*scale);
		cxt.lineTo(nodesAxes[3].x*scale,nodesAxes[3].y*scale);
		cxt.stroke();
		cxt.fillText('z',nodesAxes[3].x*scale,nodesAxes[3].y*scale);
		cxt.lineWidth = curveWidth;
	}
	
	requestFrame = requestAnimationFrame(drawFunction);	
};

// Rotate shape around the z-axis, i.e. the non-rotated axis, perpendicular to the screen. 
function rotateZ3D(theta) {
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);
    
    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        var x = node.x;
        var y = node.y;
        node.x = x * cosTheta - y * sinTheta;
        node.y = y * cosTheta + x * sinTheta;
    }
	if (isXyz) {
		for (n=0; n<nodesAxes.length; n++) {
			node = nodesAxes[n];
			x = node.x;
			y = node.y;
			node.x = x * cosTheta - y * sinTheta;
			node.y = y * cosTheta + x * sinTheta;
		}
	}
};

// Rotate shape around the y-axis, i.e. the non-rotated axis, vertical to the screen.
function rotateY3D(theta) {
    var sinTheta = Math.sin(-theta);
    var cosTheta = Math.cos(-theta);
    
    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        var x = node.x;
        var z = node.z;
        node.x = x * cosTheta - z * sinTheta;
        node.z = z * cosTheta + x * sinTheta;
    }
	if (isXyz) {
		for (n=0; n<nodesAxes.length; n++) {
			node = nodesAxes[n];
			x = node.x;
			z = node.z;
			node.x = x * cosTheta - z * sinTheta;
			node.z = z * cosTheta + x * sinTheta;
		}
	}
};

// Rotate shape around the x-axis, i.e. the non-rotated axis, horizontal to the screen.
function rotateX3D(theta) {
    var sinTheta = Math.sin(-theta);
    var cosTheta = Math.cos(-theta);
    
    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        var y = node.y;
        var z = node.z;
        node.y = y * cosTheta - z * sinTheta;
        node.z = z * cosTheta + y * sinTheta;
    }
	if (isXyz) {
		for (n=0; n<nodesAxes.length; n++) {
			node = nodesAxes[n];
			y = node.y;
			z = node.z;
			node.y = y * cosTheta - z * sinTheta;
			node.z = z * cosTheta + y * sinTheta;
		}
	}
};

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
};
/*
document.getElementById("sigma").oninput = function(){
	
	counter = 1;
	sigma = this.value;
	 nodes =[];
 	nodesNoTransform =[];
	nodesAxes =[];
	start();
	initial();
	drawFunction();
};
document.getElementById("rho").oninput = function(){
    
};
document.getElementById("beta").oninput = function(){
    
};
*/
