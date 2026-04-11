// Dimensions for A5 at 96 PPI: roughly 560 x 794
// We can use SVG standard sizing
const A5_WIDTH = 560;
const A5_HEIGHT = 794;

let doExport = false;

function setup() {
    // Check if we are running in the browser and binding UI buttons
    const canvasContainer = document.getElementById('p5-container');

    // We start off rendering locally using canvas/SVG depending on the mode
    // We use SVG mode so p5 handles SVG primitives out of the box correctly.
    let renderer = createCanvas(A5_WIDTH, A5_HEIGHT, SVG);

    if (canvasContainer) {
        renderer.parent(canvasContainer);

        // Bind HTML buttons
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
    // Generate new random seed
    randomSeed(millis());
    redraw();
}

function draw() {
    clear();

    stroke(0);
    strokeWeight(1.5);
    noFill();

    // Leave a comfortable 20px margin around A5 paper (pen plotters aren't perfect at edges)
    const margin = 30;
    const cols = 5;
    const rows = 7;

    const cellW = (A5_WIDTH - margin * 2) / cols;
    const cellH = (A5_HEIGHT - margin * 2) / rows;

    translate(margin, margin);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * cellW;
            let y = j * cellH;

            // Draw a nested primitive in each cell
            drawCell(x, y, cellW, cellH);
        }
    }

    // Handle export request from button press
    if (doExport) {
        // save function from p5.js-svg dumps the SVG graphic natively!
        save("output.svg");
        console.log("SVG Exported!");
        doExport = false;
    }
}

// Function to draw some nested shapes
function drawCell(x, y, w, h) {
    push();
    translate(x + w / 2, y + h / 2);

    // Slight padding inside cell
    let padding = 5;
    let maxDim = Math.min(w, h) - padding * 2;

    // Randomly decide what to draw
    //let rType = floor(random(2));
    let rType = 1;
    let steps = floor(random(3, 8)); // Number of nested shapes

    for (let i = 0; i < steps; i++) {
        let size = map(i, 0, steps - 1, maxDim, maxDim * 0.1);

        // Ensure no division by zero or errors
        if (size <= 0) continue;

        if (rType === 0) {
            // Nested circles
            circle(0, 0, size);
        } else if (rType === 1) {
            // Nested rectangles
            rectMode(CENTER);
            rect(0, 0, size, size);
        } else {
            // Mixed or diamond shapes
            rotate(PI / 4);
            rectMode(CENTER);
            rect(0, 0, size, size);
            rotate(-PI / 4);
        }
    }
    pop();
}
