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
    "yellow_ball.png"
];

function on_click() {
    alert("ball pressed")
};

function randomInt(bound) {
    return Math.floor(Math.random() * bound);
}

// https://stackoverflow.com/questions/5968196/how-do-i-check-if-a-cookie-exists
function getCookie(name) {
    var dc,
        prefix,
        begin,
        end;

    dc = document.cookie;
    prefix = name + "=";
    begin = dc.indexOf("; " + prefix);
    end = dc.length;

    if (begin !== -1) {
        begin += 2;
    } else {
        begin = dc.indexOf(prefix);
        if (begin === -1 || begin !== 0 ) return null;
    } 

    if (dc.indexOf(";", begin) !== -1) {
        end = dc.indexOf(";", begin);
    }

    return decodeURI(dc.substring(begin + prefix.length, end) ).replace(/\"/g, ''); 
}

function on_load() {
    var ballContainer = document.getElementById("treecontainer");
    var ballImageIndexes = [];
    var cookieExists = document.cookie.indexOf("balls=") != -1;
    console.log(cookieExists);
    if (cookieExists) {
        ballImageIndexes = JSON.parse(getCookie("balls"));
    }
    
    for (var i = 0; i < positions.length; i++) {
        var currentPosition = positions[i];
        var currentBall = document.createElement("img");

        var ballImage;
        if (!cookieExists) {
            ballImage = randomInt(ballImages.length);
            ballImageIndexes.push(ballImage);
        }
        else {
            ballImage = ballImageIndexes[i];
        }
        currentBall.src = ballResourcePath + ballImages[ballImage];
        
        currentBall.style.top = currentPosition.top + "%";
        currentBall.style.right = currentPosition.right + "%";
        currentBall.style.width = "40px";
        currentBall.style.height = "40px";
        currentBall.style.position = "absolute";
        currentBall.style.zIndex = 1;
        currentBall.classList.add("img-fluid");
        
        currentBall.onclick = on_click;

        ballContainer.appendChild(currentBall);
    };
    document.cookie += "balls=" + JSON.stringify(ballImageIndexes);
    console.log(document.cookie);
};

on_load()
