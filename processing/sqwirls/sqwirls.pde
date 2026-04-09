// Draw hexagons

// Import the Processing SVG library
import processing.svg.*;

void setup() {
  size(420, 595);   // A5 portrait 
  noLoop();         
  noFill();
  stroke(204, 102, 0);
  strokeWeight(1);
  beginRecord(SVG, "sqwirl.svg");
}

void draw() {
  background(255); // Clear background for visibility
  plotShapes(50);
  endRecord();  
}

void plotShapes(int n) {
  // Define a random "center" within a 30x30 box in the middle of the canvas
  float centerX = (width/2) + random(-50, 50);
  float centerY = (height/2) + random(-15, 15);

  for (int i = 0; i < n; i++) {
    float rSize = random(20, 100);    // Random size for each hexagon
    float rRotation = random(TWO_PI); // Random rotation (0 to 360 degrees)
    
    pushMatrix();
    translate(centerX, centerY);
    rotate(rRotation);
    drawShape(0, 0, rSize);
    popMatrix();
  }
}

void drawShape(int x, int y, float size) {
  beginShape();
  // A hexagon has 6 points every 60 degrees (PI/3 radians)
  for (int i = 0; i < 6; i++) {
    float angle = PI/3 * i;
    float vx = x + cos(angle) * size;
    float vy = y + sin(angle) * size;
    vertex(vx, vy);
  }
  endShape(CLOSE); // CLOSE ensures the last point connects to the first
}
