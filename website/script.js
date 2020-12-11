// var md = new MobileDetect(window.navigator.userAgent);
var backendURL = "https://ivik.synology.me/";
var devPassword = "c74d067bc96afb28edb526b5646c1a9319fd34879d313d4c6c55d0d4133c4d3f";

var isBadOrientation = false;

const inputFile = document.getElementById("inputFile");
const buttonFile = document.getElementById("buttonFile");
const descriptionContainer = document.getElementById("descriptioncontainer")
const loginInput = document.getElementById("loginInput");
var timeWarning = document.getElementById("timeWarning");

var isLoggedIn = getCookie("loginName") != null;

var access = false;
var enableClicks = false;
var dayOpened = undefined;
var alertDisplayed = false;
var audioDisplayed = false;
const startText = document.getElementById("descriptioncontainer").innerHTML;
var listOfOpenedBalls = [];

function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    };

    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''

    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;

    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = sha256.h = sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }

    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00' // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return; // ASCII check: only accept characters in range 0-255
        words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength)

    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);

        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            // Expand the message into 64 words
            // Used below if 
            var w15 = w[i - 15],
                w2 = w[i - 2];

            // Iterate
            var a = hash[0],
                e = hash[4];
            var temp1 = hash[7] +
                (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                +
                ((e & hash[5]) ^ ((~e) & hash[6])) // ch
                +
                k[i]
                // Expand the message schedule if needed
                +
                (w[i] = (i < 16) ? w[i] : (
                    w[i - 16] +
                    (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) // s0
                    +
                    w[i - 7] +
                    (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10)) // s1
                ) | 0);
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                +
                ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

            hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
            hash[4] = (hash[4] + temp1) | 0;
        }

        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i]) | 0;
        }
    }

    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i] >> (j * 8)) & 255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};

function grantAccess(password) {
    if (devPassword === sha256(password)) {
        access = true;
        alertUser("Developer access granted!");
        writeCookie("loginName", "7274 developer");
        try {
            document.getElementById("main").removeChild(document.getElementById("loginDiv"));
        } catch {}
        try {
            document.getElementById("main").removeChild(timeWarning);
        } catch {}
    };
};


/**
 *
 * Created by Borbás Geri on 12/17/13
 * Copyright (c) 2013 eppz! development, LLC.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */


var EPPZScrollTo = {
    /**
     * Helpers.
     */
    documentVerticalScrollPosition: function() {
        if (self.pageYOffset) return self.pageYOffset; // Firefox, Chrome, Opera, Safari.
        if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop; // Internet Explorer 6 (standards mode).
        if (document.body.scrollTop) return document.body.scrollTop; // Internet Explorer 6, 7 and 8.
        return 0; // None of the above.
    },

    viewportHeight: function() {
        return (document.compatMode === "CSS1Compat") ? document.documentElement.clientHeight : document.body.clientHeight;
    },

    documentHeight: function() {
        return (document.height !== undefined) ? document.height : document.body.offsetHeight;
    },

    documentMaximumScrollPosition: function() {
        return this.documentHeight() - this.viewportHeight();
    },

    elementVerticalClientPositionById: function(id) {
        var element = document.getElementById(id);
        var rectangle = element.getBoundingClientRect();
        return rectangle.top;
    },

    /**
     * Animation tick.
     */
    scrollVerticalTickToPosition: function(currentPosition, targetPosition) {
        var filter = 0.2;
        var fps = 60;
        var difference = parseFloat(targetPosition) - parseFloat(currentPosition);

        // Snap, then stop if arrived.
        var arrived = (Math.abs(difference) <= 0.5);
        if (arrived) {
            // Apply target.
            scrollTo(0.0, targetPosition);
            return;
        }

        // Filtered position.
        currentPosition = (parseFloat(currentPosition) * (1.0 - filter)) + (parseFloat(targetPosition) * filter);

        // Apply target.
        scrollTo(0.0, Math.round(currentPosition));

        // Schedule next tick.
        setTimeout("EPPZScrollTo.scrollVerticalTickToPosition(" + currentPosition + ", " + targetPosition + ")", (1000 / fps));
    },

    /**
     * For public use.
     *
     * @param id The id of the element to scroll to.
     * @param padding Top padding to apply above element.
     */
    scrollVerticalToElementById: function(id, padding) {
        var element = document.getElementById(id);
        if (element == null) {
            console.warn('Cannot find element with id \'' + id + '\'.');
            return;
        }

        var targetPosition = this.documentVerticalScrollPosition() + this.elementVerticalClientPositionById(id) - padding;
        var currentPosition = this.documentVerticalScrollPosition();

        // Clamp.
        var maximumScrollPosition = this.documentMaximumScrollPosition();
        if (targetPosition > maximumScrollPosition) targetPosition = maximumScrollPosition;

        // Start animation.
        this.scrollVerticalTickToPosition(currentPosition, targetPosition);
    }
};

function wasRequestSuccessful(request) {
    return request.readyState == XMLHttpRequest.DONE &&
        request.status === 0 ||
        request.status >= 200 && request.status < 400;
};

function createUser(name) {
    var createUserRequest = new XMLHttpRequest();
    const url = backendURL + "add";

    var jsonRequestData = JSON.stringify({
        "userName": name
    });

    createUserRequest.open("POST", url);
    createUserRequest.send(jsonRequestData);

    // we don't have to handle any errors, if the user doesn't exist,
    // it's created, else, it already exists.
    // if the server is down, we shouldn't even get here
};

function getOpenedWindows(name) { //RETURN ALL DAYS DONE / HOMEWORK DONE
    var openedWindowsRequest = new XMLHttpRequest();
    var url = backendURL + "windows?userName=" + name;

    openedWindowsRequest.open("GET", url, false);

    var response;
    openedWindowsRequest.onreadystatechange = function() {
        // console.log(this.responseText);
        if (wasRequestSuccessful(this)) {
            // console.log(JSON.parse(this.responseText));
            response = JSON.parse(this.responseText).response;
        } else {
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
        if (begin === -1 || begin !== 0) return null;
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
} else {
    cookie = JSON.parse(decodeURIComponent(getDataCookie()));
};

function writeCookie(key, value) {
    cookie[key] = value;
    var jsonData = decodeURIComponent(JSON.stringify(cookie)).replace("\\", "");
    document.cookie = "data=" + encodeURIComponent(jsonData);
};

const positions_small = [{
        top: "11",
        right: "43"
    }, //1
    {
        top: "16",
        right: "34"
    }, //2
    {
        top: "22",
        right: "30"
    }, //3
    {
        top: "17",
        right: "52"
    }, //4
    {
        top: "23",
        right: "60"
    }, //5
    {
        top: "20",
        right: "42"
    }, //6
    {
        top: "28",
        right: "24"
    }, //7
    {
        top: "25.5",
        right: "50"
    }, //8
    {
        top: "28",
        right: "38"
    }, //9
    {
        top: "30.5",
        right: "60"
    }, //10
    {
        top: "35",
        right: "20"
    }, //11
    {
        top: "38",
        right: "66"
    }, //12
    {
        top: "33",
        right: "50"
    }, //13
    {
        top: "40",
        right: "32"
    }, //14
    {
        top: "34",
        right: "36"
    }, //15
    {
        top: "39.5",
        right: "52.5"
    }, //16
    {
        top: "43",
        right: "16"
    }, //17
    {
        top: "47",
        right: "28"
    }, //18
    {
        top: "46",
        right: "70"
    }, //19
    {
        top: "46",
        right: "44"
    }, //20
    {
        top: "50",
        right: "58"
    }, //21
    {
        top: "50",
        right: "8"
    }, //22
    {
        top: "53",
        right: "40"
    }, //23
];

const positions_big = [{
        top: "11",
        right: "47.5"
    }, //1
    {
        top: "16",
        right: "44"
    }, //2
    {
        top: "22",
        right: "40"
    }, //3
    {
        top: "18",
        right: "50"
    }, //4
    {
        top: "22.5",
        right: "55"
    }, //5
    {
        top: "23",
        right: "45"
    }, //6
    {
        top: "28",
        right: "39"
    }, //7
    {
        top: "25.5",
        right: "50"
    }, //8
    {
        top: "30",
        right: "44"
    }, //9
    {
        top: "30.5",
        right: "55"
    }, //10
    {
        top: "35",
        right: "39.5"
    }, //11
    {
        top: "38",
        right: "58.5"
    }, //12
    {
        top: "33",
        right: "50"
    }, //13
    {
        top: "40",
        right: "35.5"
    }, //14
    {
        top: "38",
        right: "45.4"
    }, //15
    {
        top: "39.5",
        right: "52.5"
    }, //16
    {
        top: "43",
        right: "41"
    }, //17
    {
        top: "47",
        right: "33.5"
    }, //18
    {
        top: "46",
        right: "60.5"
    }, //19
    {
        top: "46",
        right: "48.5"
    }, //20
    {
        top: "48",
        right: "54.4"
    }, //21
    {
        top: "50",
        right: "44"
    }, //22
    {
        top: "51.5",
        right: "38"
    }, //23
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
    return date.getDate();
};

function openWindow(window, userName) {
    if (typeof window == "string") {
        window = parseInt(window); // unsafe?
    }
    var openWindowRequest = new XMLHttpRequest();
    const url = backendURL + "openwindow";

    var jsonRequestData = JSON.stringify({
        "day": window,
        "userName": userName
    });


    openWindowRequest.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (wasRequestSuccessful(this)) {
                return;
            } else if (this.status == 500) {
                // server error :o
                // we probably want to display an error here.
                return;
            };
        } else {
            // server is down
        };
    };

    openWindowRequest.open("POST", url);
    openWindowRequest.setRequestHeader("Content-Type", "application/json");
    openWindowRequest.send(jsonRequestData);
};

//change ball image to broken ball
function breakeBall(containerID) {
    var container = document.getElementById("ball" + containerID);
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

function sendHomework() {
    var sendHomeworkRequest = new XMLHttpRequest();
    var homework = document.getElementById("inputFile").files;

    if (homework != undefined) {
        breakeBall(dayOpened - 1);
        openWindow(dayOpened, getCookie("loginName"));
        descriptionContainer.removeChild(document.getElementById("inputFile"));
        descriptionContainer.removeChild(document.getElementById("buttonFile"));
        writeCookie("day" + dayOpened, "true");

        var url = backendURL + "upload";

        function callback(data, name) {
            var jsonData = {
                "filename": name,
                "data": data,
                "day": parseInt(dayOpened),
                "userName": getCookie("loginName")
            };

            sendHomeworkRequest.onreadystatechange = function() {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (wasRequestSuccessful(this)) {} else if (this.status == 500) {
                        // server error :o , we probably want to display an error here
                        // actualy this happens when photo is send so...
                    };
                } else {
                    // server is down
                };
            };
            sendHomeworkRequest.open("POST", url);
            sendHomeworkRequest.setRequestHeader("Content-Type", "application/json");;
            sendHomeworkRequest.send(JSON.stringify(jsonData));
        };
        for (var i = 0; i < homework.length; i++) {
            readData(homework[i], callback);
            alertUser("Úloha úspešne odovzdaná! Výborne!");
        };
        document.getElementById("description").innerHTML = startText;
    } else {
        alertUser("Niesú pridané žiadne súbory!");
    };
    try {hideInputControls();} catch {};
    document.getElementById("descriptioncontainer").removeChild(document.getElementById("audio"));
    audioDisplayed = false;
};

function easterEgg() {
    var listOfNumbers = listOfOpenedBalls;
    if (!getCookie("easterEgg")) {
        for(let i = 0; i < listOfNumbers.length; i++){
            if (listOfNumbers[i] == 7 && listOfNumbers[i+1] == 2 && listOfNumbers[i+2] == 7 && listOfNumbers[i+3] == 4) {
                listOfNumbers = [];
                alertUser("Gratulujeme! Našiel si EasterEgg :)");
                writeCookie("easterEgg", "true");
                break;
            };
        };
    };
};

// is there a better way to do this?
function showInputControls() {
    // <input id="inputFile" class="row" type="file" accept="image/*" multiple>
    var inputElement = document.createElement("input");
    inputElement.id = "inputFile";
    inputElement.classList.add("row");
    inputElement.type = "file";
    inputElement.accept = "image/*"
    inputElement.multiple = true;

    // <button id="buttonFile" class ="row" onclick=sendHomework()>Odovzdať úlohu</button>
    var sendButton = document.createElement("button");
    sendButton.id = "buttonFile";
    sendButton.classList.add("row");
    sendButton.onclick = sendHomework;
    sendButton.textContent = "Odovzdať úlohu";

    document.getElementById("descriptioncontainer").appendChild(inputElement);
    document.getElementById("descriptioncontainer").appendChild(sendButton);
};

function getHomeworkStatus(day) {
    if (typeof day == "string") {
        day = parseInt(day);
    };
    return getOpenedWindows(getCookie("loginName")).includes(day);
};

function hideInputControls() {
    var inputElement = document.getElementById("inputFile");
    var buttonElement = document.getElementById("buttonFile");
    try {
        document.getElementById("description").removeChild(inputElement);
        document.getElementById("description").removeChild(buttonElement);
    } catch {};
};

function showIntroduction() {
    document.getElementById("text-heading").innerHTML = "Inštrukcie";
    document.getElementById("descriptioncontainer").innerHTML = startText;
    try {hideInputControls()} catch {};
    EPPZScrollTo.scrollVerticalToElementById("descriptioncontainer", 50);
};

function on_click(event) {
    if (access) {
        enableClicks = true;
    };
    if (enableClicks) {
        element = event.target; // rip IE 6-8 // :DDD
        var dayNumber = element.innerHTML;
        // listOfNumbers.push(dayNumber);
        // easterEgg();
        if (getDate() < dayNumber) {
            alertUser("Tento deň nie je k dispozícii, počkaj si :)");
        } else {
            document.getElementById("text-heading").innerHTML = "Deň " + dayNumber;
            dayOpened = dayNumber;
            listOfOpenedBalls.push(dayNumber);
            easterEgg();
            const http = new XMLHttpRequest();

            var url = backendURL + "text?day=" + dayNumber;
            http.open("GET", url);

            var description = document.getElementById("description");

            http.onreadystatechange = function() {
                if (this.responseText) {
                    if (wasRequestSuccessful(this) && this.responseText != "") {
                        description.innerHTML = JSON.parse(this.responseText).response;
                        // displayAditionalTagsFromServerResponse(JSON.parse(this.responseText).response);
                    } else if (this.responseText == "") {
                        description.innerHTML = "Server down";
                    } else if (this.readyState == XMLHttpRequest.DONE) {
                        description.innerHTML = JSON.parse(this.responseText).response;
                        // displayAditionalTagsFromServerResponse(JSON.parse(this.responseText).response);
                    } else {
                        description.innerHTML = "Error!";
                    };
                };
            };
            http.send();
            if (!getHomeworkStatus(dayNumber)) {
                try {
                    hideInputControls();
                } catch {};

                showInputControls();
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
            };
            EPPZScrollTo.scrollVerticalToElementById("descriptioncontainer", 50);
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
        } else {
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

function inTimeWarning() {
    document.body.removeChild(document.getElementById("loginDiv"));
    document.body.appendChild(timeWarning);
    var text = document.getElementById("timeWarningText");
    var time = document.getElementById("timeWarningTime");
    text.innerHTML = "Adventný kalendár nie je k dispozícii. Kalendár sa otvára v čase 13:00 - 21:00!";
};

function login() {
    loginInputEnterClickTriggerButton();
    if (!isLoggedIn) {
        EPPZScrollTo.scrollVerticalToElementById("login", 80);
        document.getElementById("loginButton").onclick = function() {
            var name = loginInput.value;
            if (name != "") {
                unBlur();
                writeCookie("loginName", name);
                onloadBreakBall();
                document.getElementById("main").removeChild(document.getElementById("login"));
                showHiddenElements();
                enableClicks = true;
                document.body.style.overflow = "auto";
            }
        };
    } else {
        var name = getCookie("loginName");
        setWindowData(name);
        unBlur();
        document.getElementById("main").removeChild(document.getElementById("login"));
        onloadBreakBall();
        showHiddenElements();
        enableClicks = true;
        document.body.style.overflow = "auto";
    };

};

function readData(file, callback) {
    var reader = new FileReader();
    reader.onload = function() {
        callback(this.result.split(",")[1], file.name);
    }
    reader.readAsDataURL(file);
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

function getDateName() {
    var dateObj = new Date();
    var weekday = dateObj.toLocaleString("sk", {
        weekday: "long"
    });
    return weekday;
};

function isWeekend() {
    var dayName = getDateName();
    if (dayName == "sobota" || dayName == "nedela") {
        return true;
    } else {
        return false;
    };
};

function inTimeAllowed() {
    if (!access && !isWeekend()) {// basicly if you have access or its weekend you go in no matter what
        var date = new Date();
        var hour = date.getHours();
        if (hour >= 13 && hour <= 20) {
            return true;
        } else {
            return false;
        };
    } else {
        return true;
    };
};

function getOrientation() {
    console.log(window.orientation % 90 == 0 && window.orientation != 0 ? "landscape" : "portrait");
    return window.orientation % 90 == 0 && window.orientation != 0 ? "landscape" : "portrait";
}

function on_load() {
    login();
    isBadOrientation = getOrientation() == "landscape";
    if (isBadOrientation) {
        alertUser("Táto stránka bohužiaľ funguje iba v portrait móde. Otoč prosím svoju obrazovku.");
        document.getElementById("alertDiv").style.height = "40vh";
    }

    window.addEventListener("orientationchange", function() {
    
        var isPortrait = getOrientation() == "portrait";
        if (!isPortrait) {
            alertUser("Táto stránka bohužiaľ funguje iba v portrait móde. Otoč prosím svoju obrazovku.");
            document.getElementById("alertDiv").style.height = "40vh";
            document.getElementById("alertDiv").removeChild(document.getElementById("alertButton"));
        }
        else {
            if (!isLoggedIn) {
                EPPZScrollTo.scrollVerticalToElementById("loginDiv", 50);
            }
            if (document.getElementById("alertDiv") != null) {
                document.body.removeChild(document.getElementById("alertDiv"));
                unBlur();
                alertDisplayed = false;
            }   
        }
    }, false);
    var ballContainer = document.getElementById("treecontainer");
    var ballImageIndexes = [];
    var cookieExists = document.cookie.indexOf("balls") != -1;
    if (cookieExists) {
        ballImageIndexes = getCookie("balls");
    };

    if (screen.width > 1000) {
        positions = positions_big;
    } else {
        positions = positions_small;
    };

    for (let i = 0; i < positions.length; i++) {
        var currentPosition = positions[i];
        var currentBall = document.createElement("div");

        var ballImage;
        if (!cookieExists) {
            ballImage = randomInt(ballImages.length - 1);
            ballImageIndexes.push(ballImage);
        } else {
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
    starConfig();

    if (!cookieExists) {
        writeCookie("balls", ballImageIndexes);
    };

    if (document.getElementById("inputFile") != null) {
        document.getElementById("descriptioncontainer").removeChild(document.getElementById("inputFile"));
        document.getElementById("descriptioncontainer").removeChild(document.getElementById("buttonFile"));
    };
    
    if (timeWarning.parentElement == document.getElementById("main")) {
        document.getElementById("main").removeChild(timeWarning);
    };

    if (!inTimeAllowed()) {
        inTimeWarning();
    };

};

function starConfig() {
    var star = document.getElementById("star")
    star.onclick = function(e) {
        starClick();
    };
};

function alertUser(text) {
    if (!alertDisplayed) {
        blur();
        var div = document.createElement("div");
        var p = document.createElement("p");
        var button = document.createElement("button");
        div.id = "alertDiv";
        div.classList.add("fixed-top");
        div.classList.add("mx-auto");
        p.innerHTML = text;
        p.id = "alertP";
        button.innerHTML = "Ok";
        button.id = "alertButton";
        button.classList.add("mx-auto");
        button.onclick = function() {
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

function isBroken(ballNumber) {
    var ballContainer = document.getElementById("ball" + ballNumber);
    var imageSrc = ballContainer.style.backgroundImage;
    if (imageSrc.includes("_broken")) return true
    else return false;
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
    while (responseText == "") { //we dont have better idea :D
    };
    return responseText;
};

function unBlur() {
    var elementsToUnBlur = document.getElementsByClassName("blur");
    for (var i = 0; i < elementsToUnBlur.length; i++) {
        elementsToUnBlur[i].style.filter = "blur(0px) brightness(100%)";
    }
    var elementsToResetColor = document.getElementsByClassName("background");
    for (var i = 0; i < elementsToResetColor.length; i++) {
        elementsToResetColor[i].style.backgroundColor = "white";
    }
};

function blur() {
    var elementsToBlur = document.getElementsByClassName("blur");
    for (var i = 0; i < elementsToBlur.length; i++) {
        elementsToBlur[i].style.filter = "blur(10px) brightness(70%)";
    }

    var elementsToSetBackground = document.getElementsByClassName("background");
    for (var i = 0; i < elementsToSetBackground.length; i++) {
        elementsToSetBackground[i].style.backgroundColor = "rgba(0,0,0, 0.4)";
    }
};

$(window).scroll(function(e) {
    // add/remove class to navbar when scrolling to hide/show
    var scroll = $(window).scrollTop();
    if (scroll >= 150) {
        $('.navbar').addClass("navbar-hide");
    } else {
        $('.navbar').removeClass("navbar-hide");
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = function() {
        particlesJS("snow", {
            "particles": {
                "number": {
                    "value": 200,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#82e0ff"
                },
                "opacity": {
                    "value": 0.7,
                    "random": false,
                    "anim": {
                        "enable": false
                    }
                },
                "size": {
                    "value": 5,
                    "random": true,
                    "anim": {
                        "enable": false
                    }
                },
                "line_linked": {
                    "enable": false
                },
                "move": {
                    "enable": true,
                    "speed": 5,
                    "direction": "bottom",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": true,
                        "rotateX": 300,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "events": {
                    "onhover": {
                        "enable": false
                    },
                    "onclick": {
                        "enable": false
                    },
                    "resize": false
                }
            },
            "retina_detect": true
        });
    }
    document.head.append(script);
});

window.onload = () => on_load();