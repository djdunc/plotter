import processing.svg.*;

void setup() {
  size(420, 595);   
  noLoop();         
  noFill();
  stroke(204, 102, 0, 150); // Added slight transparency (150) for overlapping petals
  strokeWeight(1);
  beginRecord(SVG, "organic_petals.svg");
}

void draw() {
  background(255);
  plotShapes(40);
  endRecord();  
}

void plotShapes(int n) {
  float centerX = width/2 + random(-15, 15);
  float centerY = height/2 + random(-15, 15);

  for (int i = 0; i < n; i++) {
    float rSize = random(40, 120);
    float rRotation = random(TWO_PI);
    
    pushMatrix();
    translate(centerX, centerY);
    rotate(rRotation);
    drawShape(0, 0, rSize, i); // Pass 'i' to create a unique noise seed per shape
    popMatrix();
  }
}

void drawShape(float x, float y, float radius, int seed) {
  beginShape();
  
  // To make a curveVertex loop perfectly, we repeat the first and last points
  for (int i = -1; i < 7; i++) {
    float angle = PI/3 * i;
    
    // Perlin Noise offset calculation
    // We use cos/sin of the angle to ensure the noise wraps around the circle
    float xOffset = cos(angle) + 1; 
    float yOffset = sin(angle) + 1;
    float noiseVal = noise(xOffset * 0.5, yOffset * 0.5, seed * 0.1);
    
    // Distort the radius slightly based on the noise
    float distortedRadius = radius + map(noiseVal, 0, 1, -15, 15);
    
    float vx = x + cos(angle) * distortedRadius;
    float vy = y + sin(angle) * distortedRadius;
    
    curveVertex(vx, vy);
  }
  
  endShape(CLOSE);
}
