var backendURL = "http://localhost:8080/";

var positions = [
    {top:"20", right:"48"},//blue right up 01
    {top:"60", right:"45"},//orange left middle_down 02
    {top:"33", right:"43"},//orange_red left middle_up 03
    {top:"46", right:"47"},//pink left middle 04
    {top:"55", right:"18"},//purple right middle_down 05
    {top:"40", right:"26"},//red midle_right midle 06
    {top:"38", right:"59"},//white midle midle 07
    {top:"30", right:"34"},//pink2 right up 08
    {top:"54", right:"57"},//yellow midle midle_down 09
    {top:"50", right:"71"},//blue right midle 10
    {top:"65", right:"29"},//orange right down 11
    {top:"70", right:"39"},//orange_red midle down 12
    {top:"72", right:"60"},//pink left down 13
    {top:"51", right:"32"},//purple left midle 14
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
    "pink_ball.png",
    "yellow_ball.png"
];

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

function on_click(event) {
    element = event.target; // rip IE 6-8
    var dayNumber = element.innerHTML;
    const http = new XMLHttpRequest();
    const url = backendURL + "text?day=" + dayNumber;
    http.open("GET", url);
    http.send();
    
    http.onreadystatechange= (e)=> {
        if (this.readyState == 4 && // request is done 
            this.status == 200) { // response code is OK
            const textElement = document.getElementById("description");
            textElement.innerHTML = http.responseText;
        }
        else {
            alert("server error! http status code " + e.status);
        }
    }
};

function randomInt(bound) {
    return Math.floor(Math.random() * bound);
}

function on_load() {
    var ballContainer = document.getElementById("treecontainer");
    var ballImageIndexes = [];
    var cookieExists = document.cookie.indexOf("balls=") != -1;
    if (cookieExists) {
        ballImageIndexes = JSON.parse(getCookie("balls"));
    }

    for (var i = 0; i < positions.length; i++) {
        var currentPosition = positions[i];
        var currentBall = document.createElement("div");

        var ballImage;
        if (!cookieExists) {
            ballImage = randomInt(ballImages.length - 1);
            ballImageIndexes.push(ballImage);
        }
        else {
            ballImage = ballImageIndexes[i];
        }

        currentBall.style.backgroundImage = "url(" + ballResourcePath + ballImages[ballImage] + ")";
        currentBall.innerHTML = i + 1;
        
        currentBall.style.top = currentPosition.top + "%";
        currentBall.style.right = currentPosition.right + "%";

        currentBall.classList.add("fluid-image");
        currentBall.classList.add("ball");

        currentBall.onclick = function(e) {
            on_click(e);
        };

        ballContainer.appendChild(currentBall);
    };
    document.cookie = "balls=" + JSON.stringify(ballImageIndexes);
};

on_load();
