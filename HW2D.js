"use strict";

var gl;
var points;
let counter = 0; // Counter to keep track of the current shape
const numShapes = 3; // Total shapes

// Define vertices for different 2D shapes
const triangleVertices = new Float32Array([
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5
]);

const squareVertices = new Float32Array([
    -0.5, 0.5,
    -0.5, -0.5,
    0.5, 0.5,
    -0.5, -0.5,
    0.5, 0.5,
    0.5, -0.5
]);

// For the circle, considering polygon with 360 sides as 1 degree will correpond to 1 segment of polygon
const polygonVertices = [];
const sides = 360;
const radius = 0.5;

for (let i = 0; i < sides; i++) {
    const theta = (i / sides) * 2 * Math.PI;
    const x = radius * Math.cos(theta);
    const y = radius * Math.sin(theta);
    polygonVertices.push(x, y);
}


window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );

    // Associate out shader variables with our data buffer
    var aPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( aPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( aPosition );
    
    // Initializing the first shape as triangle
    updateShape(triangleVertices);

    // Handling mouse click events
    canvas.addEventListener('click', toggleOnClick);
};


function toggleOnClick() {
    counter = (counter + 1) % numShapes;

    switch (counter) {
        case 0:
            updateShape(triangleVertices);
            break;
        case 1:
            updateShape(squareVertices);
            break;
        case 2:
            updateShape(new Float32Array(polygonVertices));
            break;
    }
}

// Function to update the shape in the WebGL buffer
function updateShape(vertices) {
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    render(vertices);
}

function render(vertices) {
    // Clear the canvas
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear( gl.COLOR_BUFFER_BIT );

    // Draw the shape
    if (counter === 0 || counter === 1) {
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length/2); 
    } else {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length/2); 
    }
}
