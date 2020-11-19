var positions = [
    {top:"21", right:"15"},
    {top:"40", right:"25"}
];

function on_click() {
    alert("pressed")
};

function on_load() {
    for (var i = 1; i < 3; i++) {
        var currentBall = document.getElementById("ball" + i);
        console.log(currentBall + "\nball" + i);
        var currentPosition = positions[i - 1];
        currentBall.style.top = currentPosition.top + "%";
        currentBall.style.right = currentPosition.right + "%";
    };
};

on_load()
