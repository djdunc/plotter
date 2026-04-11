// Dimensions for A5 at 96 PPI: roughly 560 x 794
const A5_WIDTH = 560;
const A5_HEIGHT = 794;

let doExport = false;
let displayMode = 0; // 0 = Flow Only, 1 = Flow + Grid, 2 = Grid Only
let currentSeed = 0;

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
        const btnToggleGrid = document.getElementById('btn-toggle-grid');
        if (btnToggleGrid) {
            btnToggleGrid.innerText = "Mode: Flow Only";
            btnToggleGrid.onclick = () => {
                displayMode = (displayMode + 1) % 3;
                if (displayMode === 0) btnToggleGrid.innerText = "Mode: Flow Only";
                else if (displayMode === 1) btnToggleGrid.innerText = "Mode: Flow + Grid";
                else if (displayMode === 2) btnToggleGrid.innerText = "Mode: Grid Only";
                redraw();
            };
        }
    }

    noLoop(); // We draw static frames
    regenerate();
}

function regenerate() {
    // Generate a new master seed and force redraw
    currentSeed = millis();
    redraw();
}

function draw() {
    // Lock the noise and random generators so redraws (like toggling the visual grid or exporting) 
    // perfectly recreate the same mathematical paths
    randomSeed(currentSeed);
    noiseSeed(currentSeed);

    clear();

    stroke(0);
    strokeWeight(1.5);
    noFill();

    // Configuration for the flow field
    let numPaths = floor(random(50, 300));
    // Reduce max steps slightly to prevent lines getting stuck overdrawing spirals
    let stepsPerPath = floor(random(30, 80));
    let stepLength = 5;

    // Zoom factor of the Perlin noise (smaller = smoother, larger = more chaotic curves)
    let noiseScale = random(0.003, 0.015);

    // The angle multiplier dictates how sharply lines can turn over the noise field.
    // High values (> 2.0) create inescapable sinkholes where lines spiral endlessly into 
    // the same pixel, causing the plotter to shred the paper with wet ink.
    // We keep this value moderate so the winds flow freely across the canvas instead of circling.
    let angleMultiplier = random(1.0, 1.8);

    // Render the visualization grid if activated (Allowing it to be exported)
    if (displayMode === 1 || displayMode === 2) {
        stroke(180, 210, 255, 150); // Soft, semi-transparent blue grid
        strokeWeight(1.2);

        let gridResolution = 20;
        for (let gx = 0; gx <= A5_WIDTH + gridResolution; gx += gridResolution) {
            for (let gy = 0; gy <= A5_HEIGHT + gridResolution; gy += gridResolution) {
                let angle = noise(gx * noiseScale, gy * noiseScale) * TWO_PI * angleMultiplier;

                push();
                translate(gx, gy);
                rotate(angle);

                // Draw a small directional tick mimicking wind
                line(0, 0, gridResolution * 0.6, 0);

                // Draw the anchor dot
                fill(180, 210, 255, 200);
                noStroke();
                circle(0, 0, 2);
                pop();
            }
        }
        // Reset pen settings for the main algorithmic drawing
        stroke(0);
        strokeWeight(1.5);
        noFill();
    }

    if (displayMode === 0 || displayMode === 1) {
        for (let i = 0; i < numPaths; i++) {
            // Start somewhere completely random on the canvas
            let x = random(A5_WIDTH);
            let y = random(A5_HEIGHT);

            // BeingShape / endShape turns the sequence of points into a continuous SVG path,
            // which physically lifts the plotter pen fewer times.
            beginShape();
            for (let j = 0; j < stepsPerPath; j++) {
                vertex(x, y);

                // Fetch Perlin noise value at this specific x,y and stretch it into a rotation angle
                // Using the angleMultiplier to prevent tight endless looping
                let angle = noise(x * noiseScale, y * noiseScale) * TWO_PI * angleMultiplier;

                // Step forward
                x += cos(angle) * stepLength;
                y += sin(angle) * stepLength;

                // Stop plotting this trajectory if it flows out of bounds
                if (x < 0 || x > A5_WIDTH || y < 0 || y > A5_HEIGHT) {
                    break;
                }
            }
            endShape();
        }
    }

    // Handle export request from button press
    if (doExport) {
        save("output.svg");
        console.log("Noise Flow Field SVG Exported!");
        doExport = false;
    }
}
