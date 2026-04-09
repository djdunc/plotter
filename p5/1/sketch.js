function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.id('bg-canvas');
  cnv.style('position', 'fixed');
  cnv.style('top', '0');
  cnv.style('left', '0');
  cnv.style('z-index', '-1');            // put behind page content
  cnv.style('pointer-events', 'none');   // let clicks go to the page

  // ensure it's the first element in <body> (helps in some layouts)
  document.body.prepend(cnv.elt);
}

function draw() {
  let n = mouseX / windowWidth;
  background(255*n, 0, 255*(1-n), 35);
  fill(mouseIsPressed ? 0 : 255);
  circle(mouseX, mouseY, 60);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}