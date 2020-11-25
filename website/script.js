var backendURL = "http://localhost:8080/";

//map click vars, needed
var mapClicked = false;
const bigMap = document.getElementById("bigMap");
const mapCloser = document.getElementById("mapCloser");
const buttonMain = document.getElementById("mapButtonMain");
const treeContainer = document.getElementById("treecontainer");
const description = document.getElementById("descriptionContainer");

function mapClick() {
    var body = document.body;
    var blurDiv = document.getElementById("blur");

    if (!mapClicked) {
        blurDiv.removeChild(description);
        blurDiv.removeChild(treeContainer);
        body.appendChild(bigMap);
        body.appendChild(mapCloser);
        mapClicked = true;
    } else {
        treeContainer.appendChild(buttonMain);
        blurDiv.appendChild(treeContainer);
        blurDiv.appendChild(description);
        body.removeChild(mapCloser);
        body.removeChild(bigMap);
        mapClicked = false;
    };
};

function getDataCookie() {
    var dc,
    prefix,
    begin,
    end;

    dc = document.cookie;
    prefix = "data" + "=";
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

    return dc.substring(begin + prefix.length, end).replace("\\"); 
}

function getCookie(name) {
    var dataCookie = getDataCookie();
    if (dataCookie == null) {
        return null;
    }
    dataCookie = decodeURIComponent(dataCookie.replace("\\", ""));
    dataCookie = JSON.parse(dataCookie);

    if (dataCookie == null) {
        return null;
    }

    return dataCookie[name];
};

var cookie;
if (getDataCookie() == null) {
    cookie = {};
}
else {
    cookie = JSON.parse(decodeURIComponent(getDataCookie()));
}

function writeCookie(key, value) {
    cookie[key] = value;
    var jsonData = decodeURIComponent(JSON.stringify(cookie)).replace("\\", "");
    document.cookie = "data=" + encodeURIComponent(jsonData);
};


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
    "blue",
    "orange",
    "orange_red",
    "pink",
    "purple",
    "red",
    "white",
    "yellow"
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

function wasRequestSuccessful(request) {
    return request.readyState == XMLHttpRequest.DONE &&
            request.status === 0 || 
            request.status >= 200 && request.status < 400;
}

function isBroken(ballNumber) {
    document.getElementById()
} 


function on_click(event) {
    element = event.target; // rip IE 6-8
    var dayNumber = element.innerHTML;
    const http = new XMLHttpRequest();
    
    const url = backendURL + "text?day=" + dayNumber;
    http.open("GET", url);

    var description = document.getElementById("description");

    http.onreadystatechange = function() {
        if (wasRequestSuccessful(this) && this.responseText != "") {
            description.innerHTML = JSON.parse(this.responseText).response;
        }
        else if (this.responseText == "") {
            description.innerHTML = "Server down";
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

function createUser(name) {
    var createUserRequest = new XMLHttpRequest();
    const url = backendURL + "add";

    var jsonRequestData = JSON.stringify({"userName": name});
    
    createUserRequest.open("POST", url);
    createUserRequest.send(jsonRequestData);

    // we don't have to handle any errors, if the user doesn't exist,
    // it's created, else, it already exists.
    // if the server is down, we shouldn't even get here
}

function openWindow(window, userName) {
    var openWindowRequest = XMLHttpRequest();
    const url = backendURL + "openwindow";

    var jsonRequestData = JSON.stringify({"day": window, "userName": userName});

    openWindowRequest.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (wasRequestSuccessful(this)) {
                return;
            }
            else if (this.status == 500) {
                // server error :o
                // we probably want to display an error here.
                return;
            }
        }
        else {
            // server is down
        }
    }

    openWindowRequest.open("POST", url);
    openWindowRequest.send(jsonRequestData);
}

function getOpenedWindows(name) {
    var openedWindowsRequest = new XMLHttpRequest();
    const url = backendURL + "windows?userName=" + name;

    openedWindowsRequest.open("GET", url);
    openedWindowsRequest.send();
}

// also handle user "account" creation
function setWindowData(name) {
    var userExistsRequest = new XMLHttpRequest();
    const url = backendURL + "exists?userName=" + name;
    
    
    userExistsRequest.open("GET", url);

    userExistsRequest.onreadystatechange = function() {
        console.log(this.responseText);
        if (wasRequestSuccessful(this)) {
            createUser(name);
        }
        else {
            // TODO: add some kind of error, warning for users, that the server is down
            // panic
        }
        getOpenedWindows(name);
    }

    userExistsRequest.send();    
};

function login() { 
    var isLoggedIn = getCookie("loginName") != null;
    if (!isLoggedIn) {
        document.getElementById("loginButton").onclick = function() {
            var name = document.getElementById("loginInput").value;
            if (name != "") {
                unBlur();
                writeCookie("loginName", name);
            };  
        };
    } else {
        var name = getCookie("loginName");
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
function breakeBall(ballColor, ballContainerID) {
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

        currentBall.style.backgroundImage = "url(" + ballResourcePath + ballImages[ballImage] + "_ball.png)";
        var ballColor = ballImages[ballImage]//.replace("_ball.png", "")
        currentBall.innerHTML = i + 1;

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
        writeCookie("balls", ballImageIndexes);

    };

    document.body.removeChild(document.getElementById("bigMap"));
    document.body.removeChild(document.getElementById("mapCloser"));
    window.scrollTo(0, 0);
};

on_load();