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

function randomInt(bound) {
  return Math.floor(Math.random() * bound);
};

function on_load() {
  // login();
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

  // descriptionContainer.removeChild(inputFile);
  // descriptionContainer.removeChild(buttonFile);
  window.scrollTo(0, 0);
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
      this.x += window.innerWidth + this.size;
    }

    if (this.y > window.innerHeight + this.size) {
      this.x = Math.random() * window.innerWidth;
      this.y -= window.innerHeight + this.size * 2;
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
  }

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