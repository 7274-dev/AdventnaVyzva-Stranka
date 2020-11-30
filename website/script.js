var backendURL = "http://92.52.4.175:8080/";

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


var dayOpened = undefined;
var alertDisplayed = false;

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
    for(var i = 0; i < listOfNumbers.length(); i++){
        if (listOfNumbers[i] == 7 & listOfNumbers[i+1] == 2 & listOfNumbers[i+2] == 7 & listOfNumbers[i+3] == 4){
            console.log("EasterEgg")
        } 
    }

}

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
    element = event.target; // rip IE 6-8
    var dayNumber = element.innerHTML;
    listOfNumbers.push(dayNumber);
    if (getDate() < dayNumber) {
        console.log(getDate());
        alertUser("Tento deň nieje k dispozícií, počkaj si :)");
    }
    else {
        dayOpened = dayNumber;
    const http = new XMLHttpRequest();
    
    var url = backendURL + "text?day=" + dayNumber;
    http.open("GET", url);

    var description = document.getElementById("description");

    http.onreadystatechange = function() {
        if (wasRequestSuccessful(this) && this.responseText != "") {
            this.responseText.replace("\n", "<br>")
            description.innerHTML = JSON.parse(this.responseText).response;//should this be here? ".response"
            displayAditionalTagsFromServerResponse(JSON.parse(this.responseText).response);//should this be here? ".response"
        }
        else if (this.responseText == "") {
            description.innerHTML = "Server down";
        }
        else if (this.readyState == XMLHttpRequest.DONE) {
            description.innerHTML = JSON.parse(this.responseText).response;//should this be here? ".response"
            displayAditionalTagsFromServerResponse(JSON.parse(this.responseText).response);//should this be here? ".response"
        }
        else {
            description.innerHTML = "Error!";
        };
    };
    http.send();
    if (!getHomeworkStatus(dayNumber)) {
        uploadFileShow();
    } else {
        alertUser("Táto úloha je už hotová!");
    };
    };
};

//tags [audio:url], [image:url], [hyperlink:url]
//add special tag, needs to be caled for every special tag, tagName can be image/audio/hyperlink, response is server response
function displayAditionalTagsFromServerResponse(response) {
  var text = response.split(" ");
  var tags = ["audio", "image", "hyperlink"];
  for (var tag in tags) {
    for (var txt in text) {
      if (txt.includes(tag)) {
        var link = text.indexOf(tag).replace("[" + tag + ":", "");
        link = link.replace("]", "");
        if (tag == "image") {
            var element = document.createElement("a");
            element.href = link;
            element.innerHTML = "<img src=" + link + " download>";
        } else {
            var element = document.createElement(tag);
            if (tag == "audio") {
              element.controls = true;
              element.src = link;
            } else if (tag == "hyperlink") {
                element.href = link;
            };
            document.body.appendChild(element);
        };
      };
    };
  };
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
                alertUser("Niečo sa pokazilo...");
                return;
            }
        }
        else {
            // server is down
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
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa");
    openedWindowsRequest.onreadystatechange = function() {
        console.log(this.responseText);
        if (wasRequestSuccessful(this)) {
            console.log(JSON.parse(this.responseText));
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
        console.log(this.responseText);
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
    var blurBackground = document.getElementById("blurbackground");
    var blur = document.getElementById("blur");
    blurBackground.style.backgroundColor = "white";
    blur.style.filter = "blur(0px) brightness(100%)";
    document.body.style.overflow = "scroll";
};

//needed in future, dont delete
function breakeBall(ballColor, ballContainerID) {
    //startup info
    ballContainer = document.getElementById("ball" + ballContainerID);
    //replace that file with broken file
    if (ballColor == "yellow") {
        var nextColor = ballColor.replace("yellow", "white");
    } else if (ballColor == "orange_red") {
        var nextColor = "red";
    } else {
        var nextColor = ballColor;
    };
    nextColor = nextColor.replace('")', '_broken_ball.png)');
    nextColor = nextColor.replace('"', "");
    ballContainer.style.backgroundImage = nextColor;
};

function uploadFileShow() {
    descriptionContainer.appendChild(inputFile);
    descriptionContainer.appendChild(buttonFile);
};

//finish this shit
function sendHomework() {
    var sendHomeworkRequest = new XMLHttpRequest();
    var homework = inputFile.files;
    var ballColor = document.getElementById("ball" + dayOpened).style.backgroundImage.replace("_ball.png", "");
    breakeBall(ballColor, dayOpened - 1);

    if (homework) {
        openWindow(dayOpened, getCookie("loginName"));
        descriptionContainer.removeChild(inputFile);
        descriptionContainer.removeChild(buttonFile);
        writeCookie("day" + dayOpened, "true");
        var formData = new FormData();
        var url = backendURL + "upload";
        
        console.log(homework[0]);
    
        formData.append("File", homework[0], homework[0].name);


        formData.append("name", getCookie("loginName"));
        formData.append("day", dayOpened);


        sendHomeworkRequest.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE) {
                if (wasRequestSuccessful(this)) {
                    alertUser("Úloha úspešne odovzdaná! " + homework);
                }
                else if (this.status == 500) {
                    // server error :o , we probably want to display an error here
                    alertUser("Niečo sa pokazilo... Skontrolujte pripojenie k internetu");
                }
            }
            else {
                // server is down
                alertUser("Problém je na našej strane... Poruchu sa pokúsime odstrániť čo najsôr");
            };
        };

        sendHomeworkRequest.open("POST", url);
        sendHomeworkRequest.send(formData);
    } else {
        alertUser("Niesú pridané žiadne súbory!");
    };
};

function randomInt(bound) {
    return Math.floor(Math.random() * bound);
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
    window.scrollTo(0, 0);
};

//Unexpected end of JSON.parse() help: https://stackoverflow.com/questions/51118396/uncaught-syntaxerror-unexpected-end-of-json-input-at-json-parse-anonymous

on_load();
