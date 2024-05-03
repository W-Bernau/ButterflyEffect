#ifdef GL_ES
precision highp float;
#endif

varying vec2 pos;

uniform float minx;
uniform float maxx;
uniform float miny;
uniform float maxy;

const float MAX_ITERATIONS = 100.0;

const vec4 startColour = vec4(0.0, 0.0, 0.0, 1.0);
const vec4 endColour = vec4(1.0, 1.0, 1.0, 1.0);

// https://en.wikipedia.org/wiki/Mandelbrot_set#Computer_drawings
float iterateMandelbrot(vec2 coord) {
  // initialise x and y as 0
  float x = 0.0;
  float y = 0.0;
  // iterate for maximum iterations
  for(float i = 0.0; i < MAX_ITERATIONS; i ++) {
	// exit condition
    // return how many iterations as % of max
    if(x * x + y * y > 4.0) {
      return i/MAX_ITERATIONS;
    }
    
    float xtemp = x * x - y * y + coord.x;
    y = 2.0 * x * y + coord.y;
    x = xtemp;
  }
  return 1.0;
}

void main() {
  
  // lerp between the min and max coordinates
  float x = ((maxx - minx) * pos.x) + minx;
  float y = ((maxy - miny) * pos.y) + miny;
  
  float i = iterateMandelbrot(vec2(x, y));
  
  gl_FragColor = mix(startColour, endColour, i); // vec4(i, i, i, 1.0);
}