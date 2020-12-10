var backendURL = "https://ivik.synology.me/";

const inputFile = document.getElementById("inputFile");
const buttonFile = document.getElementById("buttonFile");
const descriptionContainer = document.getElementById("descriptioncontainer")
const loginInput = document.getElementById("loginInput");
var timeWarning = document.getElementById("timeWarning");

var access = false;
var enableClicks = false;
var dayOpened = undefined;
var alertDisplayed = false;
var audioDisplayed = false;
const startText = document.getElementById("descriptioncontainer").innerHTML;
var easterEggFound = false;

function wasRequestSuccessful(request) {
  return request.readyState == XMLHttpRequest.DONE &&
          request.status === 0 || 
          request.status >= 200 && request.status < 400;
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

function getOpenedWindows(name) {//RETURN ALL DAYS DONE / HOMEWORK DONE
  var openedWindowsRequest = new XMLHttpRequest();
  var url = backendURL + "windows?userName=" + name;

  openedWindowsRequest.open("GET", url, false);

  var response;
  openedWindowsRequest.onreadystatechange = function() {
      // console.log(this.responseText);
      if (wasRequestSuccessful(this)) {
          // console.log(JSON.parse(this.responseText));
          response = JSON.parse(this.responseText).response;
      }
      else {
          response = null;
      };
  };
  openedWindowsRequest.send();

  return response;
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

const positions_small = [
  {top:"11", right:"43"},//1
  {top:"16", right:"34"},//2
  {top:"22", right:"30"},//3
  {top:"17", right:"52"},//4
  {top:"23", right:"60"},//5
  {top:"20", right:"42"},//6
  {top:"28", right:"24"},//7
  {top:"25.5", right:"50"},//8
  {top:"28", right:"38"},//9
  {top:"30.5", right:"60"},//10
  {top:"35", right:"20"},//11
  {top:"38", right:"66"},//12
  {top:"33", right:"50"},//13
  {top:"40", right:"32"},//14
  {top:"34", right:"36"},//15
  {top:"39.5", right:"52.5"},//16
  {top:"43", right:"16"},//17
  {top:"47", right:"28"},//18
  {top:"46", right:"70"},//19
  {top:"46", right:"44"},//20
  {top:"50", right:"58"},//21
  {top:"50", right:"8"},//22
  {top:"53", right:"40"},//23
];

const positions_big = [
  {top:"11", right:"47.5"},//1
  {top:"16", right:"44"},//2
  {top:"22", right:"40"},//3
  {top:"18", right:"50"},//4
  {top:"22.5", right:"55"},//5
  {top:"23", right:"45"},//6
  {top:"28", right:"39"},//7
  {top:"25.5", right:"50"},//8
  {top:"30", right:"44"},//9
  {top:"30.5", right:"55"},//10
  {top:"35", right:"39.5"},//11
  {top:"38", right:"58.5"},//12
  {top:"33", right:"50"},//13
  {top:"40", right:"35.5"},//14
  {top:"38", right:"45.4"},//15
  {top:"39.5", right:"52.5"},//16
  {top:"43", right:"41"},//17
  {top:"47", right:"33.5"},//18
  {top:"46", right:"60.5"},//19
  {top:"46", right:"48.5"},//20
  {top:"48", right:"54.4"},//21
  {top:"50", right:"44"},//22
  {top:"51.5", right:"38"},//23
];

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

var ballResourcePath = "img/balls/";

//return random number
function randomInt(bound) {
  return Math.floor(Math.random() * bound);
};

//return day
function getDate() {
  var date = new Date;
  return date.getDay;
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
        var element = document.createElement(tag);
        if (tag == "audio") {
          element.controls = true;
        element.src = link.replace("]", "");
        document.body.appendChild(element);
        };
      };
    };
  };
};

//change ball image to broken ball
function breakeBall(containerID) {
  var container = document.getElementById(containerID);
  var oldSrc = container.style.backgroundImage;
  var oldColor = oldSrc.replace("_ball.png", "");
  if (oldColor == "orange_red") {
    var newColor = "red";
  } else if (oldColor == "yellow") {
    var newColor = "white";
  } else {
    var newColor = oldColor;
  };
  container.style.backgroundImage = "url(" + ballResourcePath + newColor + "_broken_ball.png)";
};

function uploadFileShow() {
  descriptionContainer.appendChild(inputFile);
  descriptionContainer.appendChild(buttonFile);
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
          response = JSON.parse(this.responseText).response;
      }
      else {
          response = null;
      };
  };
  openedWindowsRequest.send();

  return response;
};


function getHomeworkStatus(day) {
  if (typeof day == "string") {
      day = parseInt(day);
  };
  return getOpenedWindows(getCookie("loginName")).includes(day);
};

function on_click(event) {
  if (access) {
      enableClicks = true;
  };
  if (enableClicks) {
      element = event.target; // rip IE 6-8 // :DDD
      var dayNumber = element.innerHTML;
      document.getElementById("text-heading").innerHTML = "Deň " + dayNumber
      // listOfNumbers.push(dayNumber);
      // easterEgg();
      if (getDate() < dayNumber) {
          alertUser("Tento deň nie je k dispozícii, počkaj si :)");
      }
      else {
          dayOpened = dayNumber;
          const http = new XMLHttpRequest();

          var url = backendURL + "text?day=" + dayNumber;
          http.open("GET", url);

          var description = document.getElementById("descriptioncontainer");

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
                  document.getElementById("descriptioncontainer").removeChild(document.getElementById("audio"));
                  audioDisplayed = false;
              };
              var audio = document.createElement("audio");
              audio.src = "resources/nahravky/day" + dayNumber + ".wav";
              audio.id = "audio";
              audio.controls = true;
              audioDisplayed = true;
              document.getElementById("descriptioncontainer").appendChild(audio);
              uploadFileShow();
          };
      };
  };
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

// fix this function
function onloadBreakBall() {
  var openedBalls = getOpenedWindows(getCookie("loginName"));
  for (let ball in openedBalls) {
      console.log("Breaking ball " + ball);
      breakeBall(ball);
  };
};

function showHiddenElements() {
  var elements = document.getElementsByClassName("hidden-during-login");
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.visibility = "visible";
  }
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
              onloadBreakBall();
              document.getElementById("main").removeChild(document.getElementById("login"));
              showHiddenElements();
              enableClicks = true;
          }
      };
  } else {
      var name = getCookie("loginName");
      setWindowData(name);
      unBlur();
      console.log("i am out there");
      document.getElementById("main").removeChild(document.getElementById("login"));
      onloadBreakBall();
      showHiddenElements();
      enableClicks = true;
  };
  
};

function starClick() {
  if (access) {
      enableClicks = true;
  };
  if (enableClicks) {
      if (getDate() < 24) {
          alertUser("Počkaj si do Vianoc :)");
      } else {
          // code block here, needs to get filled
      };
  };
};

function on_load() {
  login();
  document.getElementById("inputFile").visibility = "hidden";
  document.getElementById("buttonFile").visibility = "hidden";
  var ballContainer = document.getElementById("treecontainer");
  var ballImageIndexes = [];
  var cookieExists = document.cookie.indexOf("balls") != -1;
  if (cookieExists) {
      ballImageIndexes = getCookie("balls");
  };

  if (screen.width > 1000) {
      positions = positions_big;
  }
  else {
      positions = positions_small;
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

  document.getElementById("star").onclick = function(e) {
    starClick();
  };
  

  window.scrollTo(0, 0);
};

function isBroken(ballNumber) {
  var ballContainer = document.getElementById("ball" + ballNumber);
  var imageSrc = ballContainer.style.backgroundImage;
  if (imageSrc.includes("_broken")) return true
  else return false;
};

function getRequest(url) {
  var responseText = "";
  const xml = new XMLHttpRequest();
  xml.open("GET", url);

  http.onreadystatechange = function() {
    checkRequestResponse(this);
  };

  xml.send();
  while (responseText == "") {//we dont have better idea :D
  };
  return responseText;
};

function checkRequestResponse(request) {
  var responseText;
  if (request.readyState == xml.DONE && request.status === 0 || request.status >= 200 && request.status < 400) {
    // this will happen when document is ready, here is variable with text:
    responseText = JSON.parse(request.responseText).response;
  } else if (request.responseText == "") {
    // server is down :o, we want to display error here
    responseText = "Problém je na našej strane... Prosím počkajte, problém sa pokúsime čo najsôr odstrániť.";
  } else if (request.readyState == XMLHttpRequest.DONE) {
    //something is wrong, but we still got the response
    responseText = JSON.parse(request.responseText).response;
  } else {
    //wow when this happends everything is fucked up, bc this should never happen
    responseText = "Oh, vyzerá to tak že sa niečo fakt pokazilo... Skúste skontrolovať pripojenie k internetu.";
  };
  return responseText;
};

function postRequest(url, data) {
  var xml = new XMLHttpRequest();
  xml.open("POST", url);

  http.onreadystatechange = function() {
    checkRequestResponse(this);
  };

  xml.send(JSON.stringify(data));
  while (responseText == "") {//we dont have better idea :D
  };
  return responseText;
};

function unBlur() {
  document.getElementsByClassName("blur")[0].style.filter = "blur(0px) brightness(100%)";
  document.getElementsByClassName("background")[0].style.backgroundColor = "white";
};

function blur() {
  document.getElementsByClassName("blur")[0].style.filter = "blur(10px) brightness(70%)";
  document.getElementsByClassName("background")[0].style.backgroundColor = "rgba(0,0,0, 0.4)";
};

var Snowflake = (function() {

  var flakes;
  var flakesTotal = 250;
  var wind = 0;
  var mouseX;
  var mouseY;

  function Snowflake(size, x, y, vx, vy) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.hit = false;
    this.melt = false;
    this.div = document.createElement('div');
    this.div.classList.add('snowflake');
    this.div.style.width = this.size + 'px';
    this.div.style.height = this.size + 'px';
  }

  Snowflake.prototype.move = function() {
    if (this.hit) {
      if (Math.random() > 0.995) this.melt = true;
    } else {
      this.x += this.vx + Math.min(Math.max(wind, -10), 10);
      this.y += this.vy;
    }

    // Wrap the snowflake to within the bounds of the page
    if (this.x > window.innerWidth + this.size) {
      this.x -= window.innerWidth + this.size;
    }

    if (this.x < -this.size) {
      this.x += window.innerWidth + this.size
      this.melt = false;
    }

    var dx = mouseX - this.x;
    var dy = mouseY - this.y;
    this.hit = !this.melt && this.y < mouseY && dx * dx + dy * dy < 2400;
  };

  Snowflake.prototype.draw = function() {
    this.div.style.transform =
    this.div.style.MozTransform =
    this.div.style.webkitTransform =
      'translate3d(' + this.x + 'px' + ',' + this.y + 'px,0)';
  };

  function update() {
    for (var i = flakes.length; i--; ) {
      var flake = flakes[i];
      flake.move();
      flake.draw();
    }
    requestAnimationFrame(update);
  };

  Snowflake.init = function(container) {
    flakes = [];

    for (var i = flakesTotal; i--; ) {
      var size = (Math.random() + 0.2) * 12 + 1;
      var flake = new Snowflake(
        size,
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        Math.random() - 0.5,
        size * 0.3
      );
      container.appendChild(flake.div);
      flakes.push(flake);
    }
    
    container.onmousemove = function(event) {
      mouseX = event.clientX;
      mouseY = event.clientY;
      wind = (mouseX - window.innerWidth / 2) / window.innerWidth * 6;
    };

    container.ontouchstart = function(event) {
      mouseX = event.targetTouches[0].clientX;
      mouseY = event.targetTouches[0].clientY;
      event.preventDefault();
    };

    window.ondeviceorientation = function(event) {
      if (event) {
        wind = event.gamma / 10;
      }
    };
    
    update();
  };

  return Snowflake;
}());

window.onload = function() {
  setTimeout(function() {
    Snowflake.init(document.getElementById('snow'));
  }, 0);
}

$(window).scroll(function(e) {
  // add/remove class to navbar when scrolling to hide/show
  var scroll = $(window).scrollTop();
  if (scroll >= 150) {
      $('.navbar').addClass("navbar-hide");
  } else {
      $('.navbar').removeClass("navbar-hide");
  }
});

on_load();