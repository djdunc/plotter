// Draw wavy lines down the page using Perlin Noise

// Import the Processing SVG library
import processing.svg.*;

int margin = 30;        // Margin around the edges
int numLines = 30;      // Number of lines to draw

void setup() {
  size(420,595);  // A5 portrait // Canvas size for A5 in mm, converted to pixels at 72 PPI
  noLoop();       // Ensure we draw only once
  noFill();
  stroke(204, 102, 0);
  strokeWeight(1);
  beginRecord(SVG, "joy.svg");
}

void draw() {
  drawLines();
  endRecord();  // Stop recording after drawing
}

void drawLines() {
  float lineSpacing = (height - 2 * margin) / (float)(numLines - 1);
  for (int i = 0; i < numLines; i++) {
    float y = margin + i * lineSpacing;
    drawWaveLine(y);
  }
}

void drawWaveLine(float y) {
  beginShape();
  float noiseScale = 0.05; // Controls the smoothness of the waves
  for (float x = margin; x < width - margin; x++) {
    float noiseValue = noise(x * noiseScale, y * 0.01);
    float offset = map(noiseValue, 0, 1, -20, 20);
    vertex(x, y + offset);
  }
  endShape();
}
