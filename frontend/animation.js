const canvas = document.querySelector('canvas');
const lengthInput = document.querySelector('#length');
const massInput = document.querySelector('#mass');
const toggleButton = document.querySelector('#toggleButton');
const ctx = canvas.getContext('2d');
const size = {x: canvas.width, y: canvas.height};
const g = 9.81;

const getColor = (name) => {
    switch(name) {
        case 'bg':
            return "rgba(200, 200, 200, 1)";
        case 'line':
            return "rgba(13, 13, 13, 1)";
        case 'red':
            return "rgba(120, 13, 13, 1)";
    }
}

const drawBackground = () => {
    ctx.strokeStyle = getColor('line');
    ctx.fillStyle = getColor('bg');
    ctx.fillRect(0, 0, size.x, size.y);
    ctx.strokeRect(0, 0, size.x, size.y);
}

const drawBall = (point, radius) => {
    ctx.beginPath();
    ctx.fillStyle = getColor('line');
    ctx.arc(point.x, point.y, radius, 0, Math.PI*2);
    ctx.fill();
}

const drawLine = (begin, end) => {
    ctx.beginPath();
    ctx.strokeStyle = getColor('line');
    ctx.lineWidth = 5;
    ctx.moveTo(begin.x, begin.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}


const calculateEnd = (begin, length, angle) => {
    return {x: begin.x + Math.sin(angle)*length, y: begin.y + Math.cos(angle)*length};
} 

const getT = (length) => {
    return 2*Math.PI*Math.sqrt(length/g);
}

const getDeltaAngle = (length) => {
    const T = getT(length);
    return 2*maxAngle/T/fps;
}

const draw = () => {
    drawBackground();
    angle += direction * getDeltaAngle(params.length/10000);
    if(Math.abs(angle) > maxAngle) {
        direction *= -1;
        // console.log("change direction");
    }
    // console.log('Angle = ' + angle);
    const begin = {x: size.x/2, y: 50};
    const end = calculateEnd(begin, params.length, angle);

    drawLine(begin, end)
    drawBall(end, params.mass/10);
    if(stop) {
        return;
    }
    setTimeout(() => {
        requestAnimationFrame(draw);
    }, fpsInterval);
}

const toggleAnimation = () => {
    if(!isAnimated){
        isAnimated = true;
        angle = 0;
        direction = 1;
        toggleButton.value = "STOP";
        stop = false;
        draw();
    } else {
        isAnimated = false;
        angle = 0;
        direction = 1;
        toggleButton.value = "START";
        stop = true;
        draw();
    }
}

const refreshInputValue = () => {
    params.length = lengthInput.value;
}

const refreshMassValue = () => {
    params.mass = massInput.value;
}

const saveParams = async (username) => {
    const response = await fetch(`/api/${username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    });
}


// Parameters
let angle;
let direction;
let stop;
let isAnimated = true;
const maxAngle = 7*Math.PI/180;
const params = {length: 100, mass: 300}
const fps = 90;
const fpsInterval = 1000/fps;

// Bindings
// canvas.addEventListener('click', startAnimation);
toggleButton.addEventListener('click', toggleAnimation);
lengthInput.addEventListener('change', refreshInputValue);
massInput.addEventListener('change', refreshMassValue);

toggleAnimation();