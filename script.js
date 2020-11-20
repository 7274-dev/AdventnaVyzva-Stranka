// todo: add relative coordinates
var positions = [
    {top:"20", right:"14"},
    {top:"60", right:"25"},
    {top:"33", right:"27"},
    {top:"46", right:"28"},
    {top:"50", right:"7"}
];

var ballResourcePath = "img/balls/";

var ballImages = [
    "blue_ball.png",
    "orange_ball.png",
    "orange_red_ball.png",
    "pink_ball.png",
    "purple_ball.png",
    "red_ball.png",
    "white_ball.png",
    "pink2_ball.png",
    "yellow_ball.png"
];

var color_list = [
    ballImages[0],
    ballImages[1],
    ballImages[2],
    ballImages[3],
    ballImages[4],
    ballImages[5],
    ballImages[6],
    ballImages[7],
    ballImages[8],
    ballImages[9],
    ballImages[1],
    ballImages[2],
    ballImages[3],
    ballImages[4],
    ballImages[5],
    ballImages[6],
    ballImages[7],
    ballImages[8],
    ballImages[9],
    ballImages[1],
    ballImages[2],
    ballImages[3],
    ballImages[4]
];

function on_click() {
    alert("ball pressed")
};

function randomInt(bound) {
    return Math.floor(Math.random() * bound);
}

function on_load() {
    var ballContainer = document.getElementById("treecontainer");
    for (var i = 0; i < positions.length; i++) {
        var currentPosition = positions[i];
        var currentBall = document.createElement("img");

        currentBall.src = ballResourcePath + color_list[i];
        
        currentBall.style.top = currentPosition.top + "%";
        currentBall.style.right = currentPosition.right + "%";
        currentBall.style.width = "40px";
        currentBall.style.height = "40px";
        currentBall.style.position = "absolute";
        currentBall.style.zIndex = 1;

        currentBall.onclick = on_click;

        ballContainer.appendChild(currentBall);
    };
};

on_load()
