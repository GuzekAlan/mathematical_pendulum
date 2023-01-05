const canvas = document.querySelector('canvas');

const draw = () => {
    const ctx = canvas.getContext("2d");
    ctx.fillRect(0, 0, 1000, 1000);
}

canvas.addEventListener('click', draw);