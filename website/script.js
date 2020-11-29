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

function getDate() {
  var date = new Date;
  return date.getDay;
};

//tags [audio:url]
function displayAditionalTagsFromServerResponse(response) {
  var text = response.split(" ");
  for (txt in text) {
    if (txt.includes("[audio:")) {
      var link = txt.replace("[audio:", "");
    };
  };
  link = link.replace("]", "");
  if (response.includes("[audio:")) {
    var audio = document.createElement("audio");
    audio.src = link;
    audio.controls = true;
    document.body.appendChild(audio);
  } else if (response.includes("[image:")) {
    var img = document.createElement("img");
    img.src = link;
    document.body.appendChild(img);
  } else if (response.includes("[hyperlink:")) {
    var hyperlink = document.createElement("a");
    hyperlink.src = link;
    document.body.appendChild(hyperlink);
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
  {top:"12", right:"48"}
];

const positions_big = [
  {top:"13", right:"45"},
  {top:"12", right:"48"}
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

  descriptionContainer.removeChild(inputFile);
  descriptionContainer.removeChild(buttonFile);
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