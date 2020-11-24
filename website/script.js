var backendURL = "http://92.52.4.175:8080/";

var state_hex = {
    other:"#c3c3c3",
    sea:"#5891c9",
    norway:"#fffff1",
    sweden:"#ffff11",
    denmark:"#fff111",
    denmarkIslandFyn:"#ff1111",
    german:"#f11111",
    checkRepublic:"#111111",
    slovakia:"#ffff22",
    austriaItaly:"#fff222",
    venice:"#ff2222",
    cma:"#f22222",
    greece:"#222222",
    turkey:"#e77eb2",
    israel:"#d4af37"
};

var positions = [
    {top:"20", right:"48"},//right up 01
    {top:"58", right:"44"},//left middle_down 02
    {top:"33", right:"46"},//left middle_up 03
    {top:"46", right:"47"},//left middle 04
    {top:"55", right:"18"},//right middle_down 05
    {top:"40", right:"26"},//midle_right midle 06
    {top:"41", right:"59"},//midle midle 07
    {top:"30", right:"34"},//right up 08
    {top:"54", right:"57"},//midle midle_down 09
    {top:"50", right:"71"},//right midle 10
    {top:"60", right:"29"},//right down 11
    {top:"70", right:"39"},//midle down 12
    {top:"74", right:"62"},//left down 13
    {top:"51", right:"32"},//left midle 14
    {top:"42", right:"38"},//right midle 15
    {top:"63", right:"68"},//left down 16
    {top:"31", right:"56"},//left up 17
    {top:"75", right:"17"},//right down 18
    {top:"76", right:"78"},//left down 19
    {top:"65", right:"82"},//left down 20
    {top:"66", right:"52"},//midle down 21
    {top:"34", right:"70"},//left midle_up 22
    {top:"68", right:"22"},//rigth down 23
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

function replaceColor(imageData, oldColor, newColor) {
    // r, g, b, a
    for (var i = 0; i < imageData; i += 4) {
        const red = imageData.data[i];
        const green = imageData.data[i + 1];
        const blue = imageData.data[i + 2];
        if (red == oldColor.red &&
            green == oldColor.green &&
            blue == oldColor.blue) {
                imageData.data[i] = newColor.red;
                imageData.data[i + 1] = newColor.green;
                imageData.data[i + 2] = newColor.blue;
        };
    };
};

//needed in future, dont remove
function setWindowData(name) {
    var userExistsRequest = new XMLHttpRequest();
};

function writeCookie(key, value) {
    document.cookie += "; " + encodeURIComponent(name) + '=' + encodeURIComponent(value);
};

function login() { 
    var isLoggedIn = getCookie("login") != null;
    if (!isLoggedIn) {
        document.getElementById("loginButton").onclick = function() {
            var name = document.getElementById("loginInput").value;
            if (name != "") {
                unBlur();
                console.log(name);
                writeCookie("login", name);
            };  
        };
    } else {
        var name = getCookie("login");
        setWindowData(name);
        unBlur();
    };
};

function unBlur() {
    var blurBackground = document.getElementById("blurbackground");
    var blur = document.getElementById("blur");
    blurBackground.style.backgroundColor = "white";
    blur.style.filter = "blur(0px) brightness(100%)";
    document.body.removeChild(document.getElementById("loginDiv"));
};

//needed in future, dont delete
function changeBallColor(ballColor, ballContainerID) {
    //startup info
    ballContainer = document.getElementById(ballContainerID);
    //replace that file with broken file
    if (ballColor == "yellow") {
        var nextColor = "white";
    } else if (ballColor == "orange_red") {
        var nextColor = "red";
    } else {
        var nextColor = ballColor;
    };
    ballContainer.style.backgroundImage = "url(" + ballResourcePath + nextColor + "_ball.png)";
};

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
    };

    if (dc.indexOf(";", begin) !== -1) {
        end = dc.indexOf(";", begin);
    };

    return decodeURI(dc.substring(begin + prefix.length, end) ).replace(/\"/g, ''); 
};

function on_click(event) {
    element = event.target; // rip IE 6-8
    var dayNumber = element.innerHTML;
    const http = new XMLHttpRequest();
    
    const url = backendURL + "text?day=" + dayNumber;
    console.log(url);
    http.open("GET", url);

    var description = document.getElementById("description");

    http.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE &&
            status === 0 | status >= 200 && status < 400) {
                description.innerHTML = JSON.parse(this.responseText).response;
            }
        else if (this.readyState == XMLHttpRequest.DONE) {
            description.innerHTML = JSON.parse(this.responseText).response;
        } 
        else {
            description.innerHTML = "Error!";
        }
    }
    http.send();
};

function randomInt(bound) {
    return Math.floor(Math.random() * bound);
};

function on_load() {
    login();
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
        var ballColor = ballImages[ballImage].replace("_ball.png", "")
        currentBall.innerHTML = i + 1;//add number to that ball
        
        currentBall.style.top = currentPosition.top + "%";
        currentBall.style.right = currentPosition.right + "%";
        currentBall.id = "ball" + i;

        currentBall.classList.add("fluid-image");
        currentBall.classList.add("ball");

        currentBall.onclick = function(e) {
            on_click(e);
        };

        ballContainer.appendChild(currentBall);
    };
    if (!cookieExists) {
        document.cookie += "balls=" + JSON.stringify(ballImageIndexes);
    };
    
};

on_load();