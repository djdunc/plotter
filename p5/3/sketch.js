let paths = [];
let numSymmetry = 6;
let angle = 360 / numSymmetry;

// Variables for the delay logic
let visiblePaths = 0; 
let lastUpdateTime = 0;
let delayInterval = 100; // Delay in milliseconds (0.2 seconds)

function setup() {
  createCanvas(420, 595);
  angleMode(DEGREES);
  noFill();
  stroke(0);
  strokeWeight(1);
  
  generateOrganicShape();
}

function draw() {
  background(255);
  translate(width / 2, height / 2);

  // Logic to increment the number of layers shown based on time
  if (millis() - lastUpdateTime > delayInterval) {
    if (visiblePaths < paths.length) {
      visiblePaths++;
      lastUpdateTime = millis();
    }
  }

  for (let i = 0; i < numSymmetry; i++) {
    push();
    rotate(i * angle);
    
    // Only loop up to the currently "visible" path count
    for (let j = 0; j < visiblePaths; j++) {
      let path = paths[j];
      drawPath(path);
      
      // Mirroring for the plotter aesthetic
      push();
      scale(1, -1);
      drawPath(path);
      pop();
    }
    pop();
  }
}

function drawPath(path) {
  beginShape();
  for (let v of path) {
    vertex(v.x, v.y);
  }
  endShape();
}

function generateOrganicShape() {
  paths = [];
  visiblePaths = 0; // Reset visibility for new generation
  lastUpdateTime = millis();
  
  let layers = 25; // Increased layers for a longer build-up
  let noiseScale = 0.02;
  let t = random(100);

  for (let j = 0; j < layers; j++) {
    let currentPath = [];
    let radiusOffset = j * 6;
    
    for (let a = 0; a <= 180; a += 2) {
      let xoff = map(cos(a), -1, 1, 0, noiseScale * 100);
      let yoff = map(sin(a), -1, 1, 0, noiseScale * 100);
      let r = map(noise(xoff + t, yoff + t, j * 0.1), 0, 1, 20, 120) + radiusOffset;
      
      currentPath.push(createVector(r * cos(a), r * sin(a)));
    }
    paths.push(currentPath);
  }
}

function mousePressed() {
  generateOrganicShape();
}