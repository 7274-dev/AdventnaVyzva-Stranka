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
    {top:"60", right:"45"},//left middle_down 02
    {top:"33", right:"43"},//left middle_up 03
    {top:"46", right:"47"},//left middle 04
    {top:"55", right:"18"},//right middle_down 05
    {top:"40", right:"26"},//middle_right middle 06
    {top:"38", right:"59"},//middle middle 07
    {top:"30", right:"34"},//right up 08
    {top:"54", right:"57"},//middle middle_down 09
    {top:"50", right:"71"},//right middle 10
    {top:"65", right:"29"},//right down 11
    {top:"70", right:"39"},//middle down 12
    {top:"72", right:"60"},//left down 13
    {top:"51", right:"32"},//left middle 14
    {top:"42", right:"35"},//right middle 15
];

var ballResourcePath = "img/balls/";

var ballImages = [
    "blue_ball",
    "orange_ball",
    "orange_red_ball",
    "pink_ball",
    "purple_ball",
    "red_ball",
    "white_ball",
    "pink_ball",
    "yellow_ball"
];

var unavailableSymbols = ["#", '"', "1", "2", "3", "4", "5", "6", "7", "8", "9", "!", "_", "?", ":", "-", "=", "%", "(", ")", "[", "]", "{", "}"];

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

function setWindowData(name) {
    console.log(name);
}

function writeCookie(key, value) {
    document.cookie = document.cookie + "; " + encodeURIComponent(name) + '=' + encodeURIComponent(value);
}

function login() { 
    // what the fuck is this
    // useless comments, unreadable code, creating static elements in js, even though they can
    // be created right when the page loads, in HTML
    // this should be moved to index.html

    var isLoggedIn = getCookie("login") != null;
    if (!isLoggedIn) {
        var loginDiv = document.createElement("div");
        var loginInput = document.createElement("input");
        var loginButton = document.createElement("button");
        var loginText = document.createElement("p");

        /* there were 2 fucking calls that used this variable, WHY?  *
         * it just makes the code more unreadable and even more shit */
        var body = document.body; // wtf why just why why why why why why why why why why why why why why why why why why why why why 
        
        //login text parameters
        loginText.innerHTML = "Prosím zadajte svoje meno:";
        loginText.id = "loginText";
        //login div parameters
        loginDiv.classList.add("login-prompt");
        loginDiv.id = "loginDiv";
        //login input parameters
        loginInput.placeholder = "Vaše meno a preizvisko";
        loginInput.id = "loginInput";
        loginInput.type = "text";
        //login button config
        loginButton.innerHTML = "Potvrdiť";
        loginButton.id = "loginButton";


        // everything was wrong here, bad indentation,
        // too much code for things that can be done with
        // one line of code useless variables and more nightmares
        loginButton.onclick = function() {
            var name = document.getElementById("loginInput").value;
            // this check is totally correct and it's very good that it's here
            if (name != "") {
                setWindowData(name);
                /* totally useless, if we are worried about DOS or DDOS, everything that *
                 * has to be done is the requests have to be rate-limited                */

                // for (var i=0; i < unavailableSymbols.length; i++) {
                //     if (name.includes(unavailableSymbols[i])) {
                //         loginText.innerHTML = "Nemôžete použiť symbol " + unavailableSymbols[i];
                //         pass = false;
                //         break;
                //     };
                // };

                var blurBackground = document.getElementById("blurbackground");
                var blur = document.getElementById("blur");
                
                blurBackground.style.backgroundColor = "white";
                blur.style.filter = "blur(0px) brightness(100%)";
                body.removeChild(loginDiv);


                writeCookie("login", name);
                
            };  
        };
        /* another useless comment */
        //adding to webpage
        loginDiv.appendChild(loginText);
        loginDiv.appendChild(loginInput);
        loginDiv.appendChild(loginButton);
        body.appendChild(loginDiv);
    }
    else {
        var name = getCookie("login");
        setWindowData(name);
    }
};

function on_ball_click(ballNumber, ballColor, ballContainer) {
    console.log("Opened ball number " + ballNumber);
    var descriptionText = document.getElementById("description");
    var descriptionContainer = document.getElementById("descriptionContainer"); // unused variable
    descriptionText.innerHTML = "";
    var nextColor;
    if (ballColor == "yellow") {
        var nextColor = "white";
    } else if (ballColor == "orange_red") {
        var nextColor = "red";
    } else {
        var nextColor = ballColor;
    };

    nextColor += "_ball_broken.png"

    ballContainer.style.backgroundImage = "url(" + nextColor + ")";
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
}

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

        currentBall.style.backgroundImage = "url(" + ballResourcePath + ballImages[ballImage] + ".png)";
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
        document.cookie += "balls=" + JSON.stringify(ballImageIndexes);
    };
    
};

on_load();