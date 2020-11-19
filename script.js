var positions = [
    {top:"41", right:"15"},
    {top:"60", right:"25"}
];

var ballResourcePath = "img/balls/";

var ballImages = [
    "blue_ball.png",
    "orange_ball.png",
    "pink_ball.png",
    "red_ball.png",
    "white_ball.png",
    "yellow_ball.png"
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

        currentBall.src = ballResourcePath + ballImages[randomInt(ballImages.length)];
        
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
