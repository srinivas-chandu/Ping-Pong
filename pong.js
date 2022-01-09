//selecting canvas
const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

//creating the user paddle
const user = {
    x : 0,
    y : canvas.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "white",
    score : 0
}

//creating the computer paddle
const com = {
    x : canvas.width - 10,
    y : canvas.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "white",
    score : 0
}

//creating the ball
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : "white"
}

//creating the net
const net = {
    x : canvas.width/2 - 1,
    y : 0,
    width : 2,
    height : 10,
    color : "white"
}

//draw rect function
function drawRect(x, y, w, h, color){
    context.fillStyle = color;
    context.fillRect(x, y , w, h);
}

//draw Circle
function drawCircle(x, y, r, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}

//controlling users paddle
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(event){
    let rect = canvas.getBoundingClientRect();
    
    user.y = event.clientY - rect.top -user.height/2
}

//reseting the ball
function resetBall(){
    ball.x = canvas.width/2
    ball.y = canvas.height/2
    ball.velocityX = -ball.velocityX;
    ball.speed = 5;
}

//drawing net
function drawNet(){
    for(let i = 0; i <= canvas.height; i += 15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

//draw Text
function drawText(text, x, y, color){
    context.fillStyle = color;
    context.font = "45px fantasy";
    context.fillText(text, x, y);
}

//collision detection
function collision(b, p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

//updating position, movement, score
function update(){
    //upadting the score
    if (ball.x - ball.radius < 0){
        //means com own
        com.score ++;
        resetBall();
    }
    else if(ball.x + ball.radius > canvas.width){
        user.score ++;
        resetBall();
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //program to control computer paddle
    computerLevel = 0.05;
    com.y += (ball.y - (com.y + com.height/2))* computerLevel;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < canvas.width/2)? user : com;

    if (collision(ball, player)){
        //where the ball hit the player
        let collidePoint = ball.y - (player.y + player.height/2);

        //normalization
        collidePoint = collidePoint/(player.height/2);

        //calculate angle in Radian
        let angleRad = collidePoint*(Math.PI/4);

        //X direction of the ball when it's hit
        let direction = (ball.x < canvas.width/2) ? 1 : -1;
        //change velocity of X and Y
        ball.velocityX = direction*ball.speed*Math.cos(angleRad);
        ball.velocityY =           ball.speed*Math.sin(angleRad);

        //everytime the ball hit a paddle , we increase the speed 
        ball.speed += 0.4;
    }
}

//render function
function render(){
    //clearing the canvas
    drawRect(0, 0, canvas.width, canvas.height, "black");

    //drawing score
    drawText(user.score, canvas.width/4, canvas.height/5, "white");
    drawText(com.score, 3*canvas.width/4, canvas.height/5, "white");

    //drawing the net
    drawNet();

    //drawing paddles
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    //drawing the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

//game init
function game(){
    update();
    render();
}

//looping
let framePerSecond = 120;
let loop = setInterval(game, 1000/framePerSecond);