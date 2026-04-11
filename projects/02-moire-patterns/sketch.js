// Dimensions for A5 at 96 PPI: roughly 560 x 794
const A5_WIDTH = 560;
const A5_HEIGHT = 794;

let doExport = false;

function setup() {
    const canvasContainer = document.getElementById('p5-container');
    let renderer = createCanvas(A5_WIDTH, A5_HEIGHT, SVG);

    if (canvasContainer) {
        renderer.parent(canvasContainer);
        document.getElementById('btn-animate').onclick = () => { regenerate(); };
        document.getElementById('btn-export').onclick = () => {
            doExport = true;
            redraw();
        };
    }

    noLoop(); // We draw static frames
    regenerate();
}

function regenerate() {
    randomSeed(millis());
    redraw();
}

function draw() {
    clear();

    stroke(0);
    strokeWeight(1.0); // Thinner stokes for finer interference detailing
    noFill();

    // Determine a random offset amount so regeneration provides different overlays
    let offset = random(5, 40);
    
    // We can randomize the angle of offset too
    let angle = random(TWO_PI);
    let xOff = cos(angle) * offset;
    let yOff = sin(angle) * offset;

    let cx1 = A5_WIDTH / 2 - xOff;
    let cy1 = A5_HEIGHT / 2 - yOff;

    let cx2 = A5_WIDTH / 2 + xOff;
    let cy2 = A5_HEIGHT / 2 + yOff;

    // How far out the circles go
    let maxRadius = Math.max(A5_WIDTH, A5_HEIGHT) * 0.9;
    
    // Distance between circles. 
    // Small step = very high density line art = strong Moiré illusions.
    // 6-8 pixels usually yields good pen plotter results without tearing A5 card.
    let densityStep = floor(random(6, 12)); 

    // Group 1
    push();
    for (let r = densityStep; r < maxRadius; r += densityStep) {
        circle(cx1, cy1, r * 2);
    }
    pop();

    // Group 2
    push();
    for (let r = densityStep; r < maxRadius; r += densityStep) {
        circle(cx2, cy2, r * 2);
    }
    pop();

    if (doExport) {
        save("output.svg");
        console.log("Moiré SVG Exported!");
        doExport = false;
    }
}
