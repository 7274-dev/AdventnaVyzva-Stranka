// jQuery.fn.snow({
  
//     // also works on any block element
//     target: jQuery("body"),
    
//     // uses font awesome iconic font
//     elements  : [
    
//       { 
//         html: '<i class="fa fa-snowflake-o" aria-hidden="true"></i>',
//         color: '#000000'
//       }
//     ]
    
//   });

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
  {top:"13", right:"38"},
  {top:"12", right:"48"},
];

const positions_big = [
  {top:"11", right:"48"},//1
  {top:"15", right:"44"},//2
  {top:"20.5", right:"40.5"},//3
  {top:"18", right:"50"},//4
  {top:"23", right:"55"},//5
  {top:"22", right:"45"},//6
  {top:"27", right:"40"},//7
  {top:"25.5", right:"50"},//8
  {top:"29", right:"45"},//9
  {top:"30", right:"55"},//10
  {top:"33", right:"41"},//11
  {top:"36", right:"58"},//12
  {top:"32", right:"50"},//13
  {top:"37", right:"37"},//14
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

function on_click(ballNumber) {
  var container = document.getElementById("ball" + ballNumber);
  var currentDate = getDate();
  if (ballNumber > currentDate) {
    //we want to display some info here that day is not avaible
  } else {
    //let them complete work and send it
  };
};

function on_load() {
  // login();
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

      currentBall.onclick = function() {
          on_click(i);
      };

      ballContainer.appendChild(currentBall);
  };
  if (!cookieExists) {
      writeCookie("balls", ballImageIndexes);
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
  document.getElementsByClassName("blur").style.filter = "blur(0px) brightness(100%)";
  document.getElementsByClassName("background").style.backgroundColor = "white";
};

function blur() {
  document.getElementsByClassName("blur").style.filter = "blur(10px) brightness(70%)";
  document.getElementsByClassName("background").style.backgroundColor = "rgba(0,0,0, 0.4)";
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
  console.log("hi");
  var scroll = $(window).scrollTop();
  if (scroll >= 150) {
      $('.navbar').addClass("navbar-hide");
  } else {
      $('.navbar').removeClass("navbar-hide");
  }
});

on_load();