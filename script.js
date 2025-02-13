let questions = [];

async function start() {
    const resp = fetch("./questions.json");

    questions = await (await resp).json();
    questions.reverse();

    goNext();
}

function loadMultipleChoice(json) {
    const body = document.getElementById("body");
    body.innerHTML = "";

    json.questions.forEach((question) => {
        const effect = question.effect;
        const text = question.text;

        const format = `<div class="question" onclick="goNext(${effect})">
                            <div class="question-label">${text}</div>
                        </div>`;

        body.innerHTML += format;

    });
}

function loadRange(json) {
    const minScale = 0.6;
    const maxScale = 1;
    const minHue = 0;
    const maxHue = 120;

    const minVal = json.min;
    const maxVal = json.max;
    const steps = json.steps - 1;

    const body = document.getElementById("body");


    for (let i = 0, scale = maxScale; i < steps + 1; i++) {
        const specialEffects = json.step_effects[i + ""];
        const label = specialEffects ? specialEffects.label : "";
        const effect = specialEffects ? specialEffects.effect : "";

        const deltaVal = (maxVal - minVal) / steps * i;
        const deltaHue = (maxHue - minHue) / steps * i;
        const deltaScale = (maxScale - minScale) / (steps);

        const val = deltaVal + minVal;
        const valRounded = Math.round(val * 100) / 100;

        const format = `<div class="range-row" onclick="goNext(${effect})">
                            <div class="balls" 
                                style="transform: scale(${scale}); 
                                    filter: hue-rotate(${deltaHue + minHue}deg)"></div>
                            <div class="range-num">${valRounded}</div>
                            <div class="range-label">${label}</div>
                        </div>`;

        body.innerHTML += format;

        if (i < Math.floor(steps / 2)) {
            scale -= deltaScale * 2;
        } else if (steps % 2 == 0 || i > Math.floor(steps / 2)) {
            scale += deltaScale * 2;
        }
        console.log("new scale: " + scale);
    }
}

async function goNext() { goNext(null); }
async function goNext(effect) {
    if (effect) eval(effect); // run the fun

    const body = document.getElementById("body");
    body.innerHTML = ""; // clear

    // white out
    body.classList.add("white");
    await new Promise(r => setTimeout(r, 400));
    body.classList.remove("white")
    await new Promise(r => setTimeout(r, 400));


    const nextQ = questions.pop();
    document.getElementById("q-label").innerText = nextQ.label;
    switch (nextQ.type) {
        case "mc":
            loadMultipleChoice(nextQ);
            break;
        case "range":
            loadRange(nextQ);
            break;
        default:
            console.error("unknown type eeee");
    }
}

addEventListener("DOMContentLoaded", (win, ev) => {
    // loadMultipleChoice();
});