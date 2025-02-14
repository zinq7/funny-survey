function goConsole() {
    console.log("GOGOGOG");
}

async function flushed() {
    document.getElementById("body").style.backgroundImage = "url(\"./flushed.png\")"
    await sleep(1000);
    document.getElementById("body").style.backgroundImage = ""
}

function yippee() {
    var yippee = new Audio("./yippee-tbh.mp3");
    yippee.play();
}

function huh() {
    document.getElementById("title").innerHTML = "Survey???"
    document.getElementsByClassName("title")[0].innerHTML = "Survey ?";
}

async function sleep(time) {
    return new Promise(r => setTimeout(r, time));
}

function balls() {

}

function freak() {
    
}