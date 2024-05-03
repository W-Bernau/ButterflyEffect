let mandelbrot; // The shader

// Define the region we want to use
// to visualise the mandelbrot set 
let centreX, centreY;
let sideLength;
let sideLengthRatio;

function preload() {
  mandelbrot = loadShader('fractal.vert', 'fractal.frag');
}

function setup() {
  createCanvas(400, 400, WEBGL);
  // uncomment for high-pixel density displays
  // pixelDensity(1);
  
  // Define default region
  centreX = -.7;
  centreY = 0;
  
  sideLength = 2.4;
  sideLengthRatio = width/height;
  
  shader(mandelbrot);
}

function draw() {
  // Calculate new region on mouse drag
  drag();
  
  // Update the region inside the shader;
  mandelbrot.setUniform("minx", centreX - (sideLength/2) * sideLengthRatio);
  mandelbrot.setUniform("maxx", centreX + (sideLength/2) * sideLengthRatio);
  mandelbrot.setUniform("miny", centreY - (sideLength/2));
  mandelbrot.setUniform("maxy", centreY + (sideLength/2));

  // Give the shader a surface to draw on
  rect(-width/2, -height/2, width, height);
}

function drag() {
  if(mouseIsPressed) {
    // Scale the difference in previous mouse
    // and current mouse pos by the sideLength 
    let dx = (pmouseX - mouseX)/width * sideLength * sideLengthRatio;
    let dy = (pmouseY - mouseY)/height * sideLength;
    
    // Update the centre pos with the mouse movement
    centreX += dx;
    centreY += dy;
  }
};



