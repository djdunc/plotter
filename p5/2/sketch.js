function setup() {
  createCanvas(100, 100);
  background(200);
  describe('A white circle on a gray background.');
}

function draw() {

  for (let i = 0; i < 10; i++) {
    // Translate the origin to the center.
    let m = [1, 0, 0, 1, 50, i*2];
    applyMatrix(m);

    // Draw the circle at coordinates (0, 0).
    circle(0, 0, 40);
  }
}