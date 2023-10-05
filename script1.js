
let canvas = document.getElementById("demoCanvas");
let context = canvas.getContext("2d");
// responsive canvas
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener("resize", setCanvasSize);

let flowers = [];
let numberOfFlowers = 25;
let speed = 6;
let collectedFlowers = 0;

let mouseX = 0,
    mouseY = 0;

class Flower {
    constructor(x, y, scale, color, speed) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.color = color;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
    };

render() {
    context.fillStyle = this.color;
    // draw a flower
    context.save(); 

    context.beginPath();
    context.ellipse(this.x, this.y, this.scale, this.scale, 1, 1, 2 * Math.PI);
    context.fill();
    context.save();
    context.translate(this.x - 2 * this.scale, this.y, 1 * this.scale);
    context.rotate(Math.PI / 3);
    context.beginPath();
    context.ellipse(0, -3, 2 * this.scale, this.scale, 0, 0, 2 * Math.PI);
    context.fill();

    context.rotate(Math.PI / 2 + 50);
    context.beginPath();
    context.ellipse(-5, 2, 2 * this.scale, this.scale, 0, 0, 2 * Math.PI);
    context.fill();
    context.restore();

    context.fillStyle = "#E89EB9";
    context.beginPath();
    context.arc(this.x - this.scale - 5, this.y - this.scale + 8, this.scale / 1.5, 0, 2 * Math.PI);
    context.fill();

    context.restore();
}

movingFlowers() {
    this.x += this.vx;
    this.y += this.vy;
}

detectWallCollision() {
    if (this.x < 0 - this.scale * 2) {
        this.x = canvas.width + this.scale * 2;
    } else if (this.x > canvas.width + this.scale * 2) {
        this.x = 0 - this.scale * 2;
    }

    if (this.y < 0 - this.scale * 2) {
        this.y = canvas.height + this.scale * 2;
    } else if (this.y > canvas.height + this.scale * 2) {
        this.y = 0 - this.scale * 2;
    }
}

detectFlowerCollision() {
    for (let j = 0; j < numberOfFlowers; j++) {
        if (this !== flowers[j]) {
            const dx = this.x - flowers[j].x;
            const dy = this.y - flowers[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.scale + flowers[j].scale) {

                const overlap = (this.scale + flowers[j].scale - distance) * 2;
                const offsetX = (dx / distance * 10) * overlap;
                const offsetY = (dy / distance * 10) * overlap;

                this.x += offsetX;
                this.y += offsetY;
                flowers[j].x -= offsetX;
                flowers[j].y -= offsetY;
            };
        };
    };
};
};


for (let i = 0; i < numberOfFlowers; i++) {
    let x = Math.floor(Math.random() * canvas.width);
    let y = Math.floor(Math.random() * canvas.height);
    let radius = Math.floor(Math.random() * 8 + 7);

    let colors = ["#F1D7BC", "white", "#FDCFDE"];
    let color = colors[Math.floor(Math.random() * colors.length)];
    flowers.push(new Flower(x, y, radius, color, speed));
};


//mousepointer
let mousePointer = new Flower(mouseX, mouseY, 10, "#E3E5D9", 10);
let distance = 0,
    dx = 0,
    dy = 0;

function main() {
    startGame();
};

function startGame() {
    updateGame();
    window.requestAnimationFrame(drawGame);
}

    //mousemove
    canvas.addEventListener("mousemove", function (event) {
    mouseX = event.clientX - canvas.getBoundingClientRect().left;
    mouseY = event.clientY - canvas.getBoundingClientRect().top;

    let scaleX = canvas.width / canvas.getBoundingClientRect().width;
    let scaleY = canvas.height / canvas.getBoundingClientRect().height;

    mouseX = mouseX * scaleX;
    mouseY = mouseY * scaleY;
});

let changeGirl = true;
function changeImage(){
if (changeGirl) {
    document.getElementById("girl").src = "images/Asset11.png";
}
};

function checkAllFlowersColored() {
    let newFlowerColored = false;
    for (let i = 0; i < numberOfFlowers; i++) {
        if (flowers[i].color !== "#E3E5D9") {
            newFlowerColored = true;
            break;
        }
    }
    if (collectedFlowers === numberOfFlowers) {
        document.getElementById("text").innerHTML = "Congratulations! You got it!";
        changeImage();
    }
}


function updateGame() {
    mousePointer.x = mouseX;
    mousePointer.y = mouseY;

    newFlowerColored = false;

    for (let i = 0; i < numberOfFlowers; i++) {
        dx = flowers[i].x - mousePointer.x;
        dy = flowers[i].y - mousePointer.y;
        distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if (distance <= flowers[i].scale * 2 && flowers[i].color !== "#E3E5D9") {
            flowers[i].color = "#E3E5D9";
            collectedFlowers++;
            document.getElementById("h3").innerHTML = collectedFlowers;
            console.log("Flower colored, collectedFlowers:", collectedFlowers);
            newFlowerColored = true; // Atualize newFlowerColored para true apenas se uma nova flor for recolorida
        }

        flowers[i].movingFlowers();
        flowers[i].detectWallCollision();
        flowers[i].detectFlowerCollision();
    }

    if (newFlowerColored) {
        checkAllFlowersColored();
    }

    window.setTimeout(updateGame, 60);
}




function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#fdf4f4";
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numberOfFlowers; i++) {
        flowers[i].render();
    }

    mousePointer.render();
    window.requestAnimationFrame(drawGame);
};

main();

