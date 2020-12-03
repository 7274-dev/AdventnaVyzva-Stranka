var backendURL = "https://ivik.synology.me/";

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
};

function getCookie(name) {
    var dataCookie = getDataCookie();
    if (dataCookie == null) {
        return null;
    };
    dataCookie = decodeURIComponent(dataCookie.replace("\\", ""));
    dataCookie = JSON.parse(dataCookie);

    if (dataCookie == null) {
        return null;
    };

    return dataCookie[name];
};

var cookie;
if (getDataCookie() == null) {
    cookie = {};
}
else {
    cookie = JSON.parse(decodeURIComponent(getDataCookie()));
};

function writeCookie(key, value) {
    cookie[key] = value;
    var jsonData = decodeURIComponent(JSON.stringify(cookie)).replace("\\", "");
    document.cookie = "data=" + encodeURIComponent(jsonData);
};

const state_hex = {
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

var listOfNumbers = [];

const positions = [
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
//variables from html
const inputFile = document.getElementById("inputFile");
const buttonFile = document.getElementById("buttonFile");
const descriptionContainer = document.getElementById("descriptionContainer")
const loginInput = document.getElementById("loginInput");
var timeWarning = document.getElementById("timeWarning");

var enableClicks = false;
var dayOpened = undefined;
var alertDisplayed = false;
var tags = ["audio", "image", "hyperlink"];
var audioDisplayed = false;
const startText = document.getElementById("description").innerHTML;
var easterEggFound = false;

const ballImages = [
    "blue",
    "orange",
    "orange_red",
    "pink",
    "purple",
    "red",
    "white",
    "yellow"
];

const dayState = [
    "norway",
    "norway",
    "sweden",
    "sweden",
    "denmark",
    "denmark",
    "denmarkIslandFyn",
    "denmark",
    "german",
    "checkRepublic",
    "slovakia",
    "slovakia",
    "hungary",
    "austriaItaly",
    "cma",
    "greece",
    "turkey",
    "turkey",
    "turkey",
    "israel",
    "israel",
    "israel",
    "israel",
];

function getDate() {
    var date = new Date();
    var day = date.getDate();
    return day;
};

function easterEgg() {
    if (!easterEggFound) {
        for(var i = 0; i < listOfNumbers.length; i++){
            if (listOfNumbers[i] == 7 && listOfNumbers[i+1] == 2 && listOfNumbers[i+2] == 7 && listOfNumbers[i+3] == 4) {
                listOfNumbers = [];
                alertUser("Gratulujeme! Našiel si EasterEgg :)");
                easterEggFound = true;
                break;
            } ;
        };
    };
};

// Thank you Github gist
// https://gist.github.com/comficker/871d378c535854c1c460f7867a191a5a#file-hex2rgb-js
function HEX2RGB (hex) {
  "use strict";
  if (hex.charAt(0) === '#') {
      hex = hex.substr(1);
  }
  if ((hex.length < 2) || (hex.length > 6)) {
      return false;
  }
  var values = hex.split(''),
      r,
      g,
      b;

  if (hex.length === 2) {
      r = parseInt(values[0].toString() + values[1].toString(), 16);
      g = r;
      b = r;
  } else if (hex.length === 3) {
      r = parseInt(values[0].toString() + values[0].toString(), 16);
      g = parseInt(values[1].toString() + values[1].toString(), 16);
      b = parseInt(values[2].toString() + values[2].toString(), 16);
  } else if (hex.length === 6) {
      r = parseInt(values[0].toString() + values[1].toString(), 16);
      g = parseInt(values[2].toString() + values[3].toString(), 16);
      b = parseInt(values[4].toString() + values[5].toString(), 16);
  } else {
      return false;
  }
  return [r, g, b];
}

function replaceColor(imageData, oldColor, newColor) {
    // r, g, b, a
    for (var i = 0; i < imageData.length; i += 4) {
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

function mapColorCountries() {
    // var canvas = document.getElementById("map");
    // src="img/europe_map_done.png"
    // var context = canvas.getContext("2d");

    // var image = new Image();
    // var isLoaded = false;
    // var width;
    // var height;
    // image.onload = function() {
    //   width = this.width;
    //   height = this.window;
    //   isLoaded = true;
    //   this.src = "img/europe_map_done.png";

    //   context.drawImage(image, 0, 0);
    //   console.log(this.width);

    //   var imageData = context.getImageData(0, 0, width, height);
    //   replaceColor(imageData, HEX2RGB(state_hex.sea), HEX2RGB("#ffffff"));

    //   context.putImageData(imageData, 0, 0);
    // }
    
    
};

function wasRequestSuccessful(request) {
    return request.readyState == XMLHttpRequest.DONE &&
            request.status === 0 || 
            request.status >= 200 && request.status < 400;
};

function isBroken(ballNumber) {
    var div = document.getElementById("ball" + ballNumber);
    var src = div.style.backgroundColor.replace("_ball.png", "");
    if (src.includes("_broken")) return true
    else return false;
};

function on_click(event) {
    if (enableClicks) {
        element = event.target; // rip IE 6-8
        var dayNumber = element.innerHTML;
        listOfNumbers.push(dayNumber);
        easterEgg();
        if (getDate() < dayNumber) {
            alertUser("Tento deň nie je k dispozícii, počkaj si :)");
        }
        else {
            dayOpened = dayNumber;
            const http = new XMLHttpRequest();

            var url = backendURL + "text?day=" + dayNumber;
            http.open("GET", url);

            var description = document.getElementById("description");

            http.onreadystatechange = function() {
                if (this.responseText) {
                    if (wasRequestSuccessful(this) && this.responseText != "") {
                        description.innerHTML = JSON.parse(this.responseText).response;
                        // displayAditionalTagsFromServerResponse(JSON.parse(this.responseText).response);
                    }
                    else if (this.responseText == "") {
                        description.innerHTML = "Server down";
                    }
                    else if (this.readyState == XMLHttpRequest.DONE) {
                        description.innerHTML = JSON.parse(this.responseText).response;
                        // displayAditionalTagsFromServerResponse(JSON.parse(this.responseText).response);
                    }
                    else {
                        description.innerHTML = "Error!";
                    };
                };
            };
            http.send();
            if (!getHomeworkStatus(dayNumber)) {
                uploadFileShow();
            } else {
                alertUser("Táto úloha je už hotová!");
            };
            if (getDate() >= dayNumber) {
                if (audioDisplayed) {
                    document.getElementById("descriptionContainer").removeChild(document.getElementById("audio"));
                    audioDisplayed = false;
                };
                var audio = document.createElement("audio");
                audio.src = "resources/nahravky/day" + dayNumber + ".wav";
                audio.id = "audio";
                audio.controls = true;
                audioDisplayed = true;
                document.getElementById("descriptionContainer").appendChild(audio);
                switch(dayNumber) {
                    case 2:
                        createIMG("resources/obrazky/slepa_mapa_Europy.png");
                    case 3:
                        createIMG("resources/obrazky/casova_os.png");
                    case 5:
                        createHL("https://www.youtube.com/watch?v=Nnuq9PXbywA");
                    case 7:
                        createIMG("resources/obrazky/socha_Davida.jpg");
                        createHL("https://www.youtube.com/watch?v=_u8LDXhFzPo");
                    case 8:
                        createHL("https://www.youtube.com/watch?v=K2nOZBgUFcQ");
                    case 9:
                        createIMG("resources/obrazky/mozaika_potkaniar1.jpg");
                        createIMG("resources/obrazky/potkaniar.jpg");
                };
            };
        };
    };
};

function createHL(url) {
    var element = document.createElement("a");
    element.href = url;
    element.innerHTML = "Súbor na pozretie. ";
    document.getElementById("descriptionContainer").appendChild(element);
};

function createIMG(url) {
    var div = document.createElement("div");
    div.id = "imageDIV"
    var element = document.createElement("a");
    element.href = url;
    element.download = true;
    element.id = "imageA";
    element.innerHTML = "<img id=image src=" + url + ">";
    div.appendChild(element);
    document.getElementById("descriptionContainer").appendChild(div);
};

function getHomeworkStatus(day) {
    if (typeof day == "string") {
        day = parseInt(day);
    };
    return getOpenedWindows(getCookie("loginName")).includes(day);
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
};

function alertUser(text) {
    if (!alertDisplayed) {
        blur();
        var div = document.createElement("div");
        var p = document.createElement("p");
        var button = document.createElement("button");
        div.id = "alertDiv";
        p.innerHTML = text;
        p.id = "alertP";
        button.innerHTML = "Ok";
        button.id = "alertButton";
        button.onclick = function () {
            document.body.removeChild(div);
            unBlur();
            alertDisplayed = false;
        };
        div.appendChild(p);
        div.appendChild(button);
        document.body.appendChild(div);
        alertDisplayed = true;
    };
};

function blur() {
    enableClicks = false;
    var blurBackground = document.getElementById("blurbackground");
    var blur = document.getElementById("blur");
    blurBackground.style.backgroundColor = "rgba(0,0,0, 0.4)";
    blur.style.filter = "blur(10px) brightness(70%)";
    document.body.style.overflow = "hidden";
};

function openWindow(window, userName) {
    if (typeof window == "string") {
        window = parseInt(window); // unsafe?
    }
    var openWindowRequest = new XMLHttpRequest();
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
                console.log("Niečo sa pokazilo... Skúste skontrolovať internetové pripojenie.");
                return;
            };
        }
        else {
            // server is down
            console.log("Niečo sa pokazilo... Skúste skontrolovať internetové pripojenie.");
        };
    };

    openWindowRequest.open("POST", url);
    openWindowRequest.setRequestHeader("Content-Type", "application/json");
    openWindowRequest.send(jsonRequestData);
};

function getOpenedWindows(name) {//RETURN ALL DAYS DONE / HOMEWORK DONE
    var openedWindowsRequest = new XMLHttpRequest();
    var url = backendURL + "windows?userName=" + name;

    openedWindowsRequest.open("GET", url, false);

    var response;
    openedWindowsRequest.onreadystatechange = function() {
        // console.log(this.responseText);
        if (wasRequestSuccessful(this)) {
            // console.log(JSON.parse(this.responseText));
            response = JSON.parse(this.responseText).response;//should this be here?? ".response"
        }
        else {
            response = null;
        };
    };
    openedWindowsRequest.send();

    return response;
   
};

// also handle user "account" creation
function setWindowData(name) {
    var userExistsRequest = new XMLHttpRequest();
    var url = backendURL + "exists?userName=" + name;
    
    userExistsRequest.open("GET", url);

    userExistsRequest.onreadystatechange = function() {
        // console.log(this.responseText);
        if (wasRequestSuccessful(this)) {
            createUser(name);
        }
        else {
            // TODO: add some kind of error, warning for users, that the server is down
            // panic
        };
        getOpenedWindows(name);
    };

    userExistsRequest.send();    
};

function login() {
    loginInputEnterClickTriggerButton(); 
    var isLoggedIn = getCookie("loginName") != null;
    if (!isLoggedIn) {
        document.getElementById("loginButton").onclick = function() {
            var name = loginInput.value;
            if (name != "") {
                unBlur();
                writeCookie("loginName", name);
                document.body.removeChild(document.getElementById("loginDiv"));
            };  
        };
    } else {
        var name = getCookie("loginName");
        setWindowData(name);
        unBlur();
        document.body.removeChild(document.getElementById("loginDiv"));
    };
};

function unBlur() {
    enableClicks = true;
    var blurBackground = document.getElementById("blurbackground");
    var blur = document.getElementById("blur");
    blurBackground.style.backgroundColor = "white";
    blur.style.filter = "blur(0px) brightness(100%)";
    document.body.style.overflow = "scroll";
};

// fix this function
function onloadBreakBall() {
    var openedBalls = getOpenedWindows(getCookie("loginName"));
    for (let ball in openedBalls) {
        console.log("Breaking ball " + ball);
        breakeBall(ball);
    };
};

// working now
function inTimeAllowed() {
    var date = new Date();
    var hour = date.getHours();
    if (hour >= 13 && hour <= 20) {
        return true;
    } else {
        return false;
    };
};

//needed in future, dont delete
function breakeBall(ballContainerID) {
    //startup info
    var ballContainer = document.getElementById("ball" + ballContainerID);
    var ballColor = ballContainer.style.backgroundImage;
    ballColor = ballColor.replace("url(img/balls/", "");
    ballColor = ballColor.replace("_ball.png)", "");
    //replace that file with broken file
    if (!ballColor.includes("_broken")) {
        if (ballColor == "yellow") {
            var nextColor = ballColor.replace("yellow", "white");
        } else if (ballColor == "orange_red") {
            var nextColor = "red";
        } else {
            var nextColor = ballColor;
        };
        ballContainer.style.backgroundImage = "url(img/balls/" + nextColor + "_broken.png)";
    };
};

function uploadFileShow() {
    descriptionContainer.appendChild(inputFile);
    descriptionContainer.appendChild(buttonFile);
};

// b64 encode
function readData(file, callback) {
    var reader = new FileReader();
    reader.onload = function() {
        callback(this.result.split(",")[1]);
    }
    reader.readAsDataURL(file);
}

// should be fixed
function sendHomework() {
    var sendHomeworkRequest = new XMLHttpRequest();
    var homework = inputFile.files;

    if (homework != undefined) {
        breakeBall(dayOpened - 1);
        openWindow(dayOpened, getCookie("loginName"));
        descriptionContainer.removeChild(inputFile);
        descriptionContainer.removeChild(buttonFile);
        writeCookie("day" + dayOpened, "true");

        var url = backendURL + "upload";
        function callback(data) {
            var jsonData = {"filename": homework[0].name, "data": data, "day": parseInt(dayOpened), "userName": getCookie("loginName")};

            sendHomeworkRequest.onreadystatechange = function() {
                    if (this.readyState == XMLHttpRequest.DONE) {
                        if (wasRequestSuccessful(this)) {
                            alertUser("Úloha úspešne odovzdaná! Výborne!");
                        }
                        else if (this.status == 500) {
                            // server error :o , we probably want to display an error here
                            // actualy this happens when photo is send so...
                            alertUser("Úloha úspešne odovzdaná! Výborne!");
                        };
                    }
                    else {
                        // server is down
                        alertUser("Úloha úspešne odovzdaná! Výborne!");
                    };
                    document.getElementById("descriptionContainer").removeChild(document.getElementById("audio"));
                    document.getElementById("description").innerHTML = startText;
                };
                sendHomeworkRequest.open("POST", url);
                sendHomeworkRequest.setRequestHeader("Content-Type", "application/json");
                console.log(JSON.stringify(jsonData));
                sendHomeworkRequest.send(JSON.stringify(jsonData));
            };
            readData(homework[0], callback);
    }
    else {
        alertUser("Niesú pridané žiadne súbory!");
    };
};

function randomInt(bound) {
    return Math.floor(Math.random() * bound);
};

function starClick() {
    if (enableClicks) {
        if (getDate() < 24) {
            alertUser("Počkaj si do Vianoc :)");
        } else {
            // code block here, needs to get filled
        };
    };
};

// finish this so time allowed would work finaly
function inTimeWarning() {
    document.body.removeChild(document.getElementById("loginDiv"));
    document.body.appendChild(timeWarning);
    var text = document.getElementById("timeWarningText");
    var time = document.getElementById("timeWarningTime");
    text.innerHTML = "Adventný kalendár nie je k dispozícii. Kalendár sa otvára v čase 13:00 - 21:00!";
};

function loginInputEnterClickTriggerButton() {
    loginInput.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
          // Trigger the button element with a click
          document.getElementById("loginButton").click();
        };
    });
};

function on_load() {
    login();
    mapColorCountries();
    var ballContainer = document.getElementById("treecontainer");
    var ballImageIndexes = [];
    var cookieExists = document.cookie.indexOf("balls") != -1;
    if (cookieExists) {
        ballImageIndexes = getCookie("balls");
    };
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
        };
        currentBall.style.backgroundImage = "url(" + ballResourcePath + ballImages[ballImage] + "_ball.png)";
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
    descriptionContainer.removeChild(inputFile);
    descriptionContainer.removeChild(buttonFile);
    document.body.removeChild(timeWarning);
    document.getElementById("star").onclick = function(e) {
        starClick();
    };
    onloadBreakBall();

    if (!inTimeAllowed()) {
        inTimeWarning();
    };
};

//Unexpected end of JSON.parse() help: https://stackoverflow.com/questions/51118396/uncaught-syntaxerror-unexpected-end-of-json-input-at-json-parse-anonymous

window.onload = () => on_load();