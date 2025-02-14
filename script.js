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

    for (let i = 0; i < json.questions.length; i++) {
        const question = json.questions[i];
        const effect = question.effect;
        const text = question.text;

        const format = `<div class="question" onclick="goNext(${effect})">
                            <div class="question-label">${text}</div>
                        </div>`;

        body.innerHTML += format;

    };
}

async function loadRange(json) {
    const minScale = 0.6;
    const maxScale = 1;
    const minHue = 0;
    const maxHue = 120;

    const minVal = json.min;
    const maxVal = json.max;
    const steps = json.steps - 1;

    const body = document.getElementById("body");


    for (let i = 0, scale = maxScale; i < steps + 1; i++) {
        await new Promise(r => setTimeout(r, 20));
        const specialEffects = json.step_effects[steps - i];
        const label = specialEffects ? specialEffects.label : "";
        const effect = specialEffects ? specialEffects.effect : "";

        const deltaVal = (maxVal - minVal) / steps * i;
        const deltaHue = (maxHue - minHue) / steps * i;
        const deltaScale = (maxScale - minScale) / (steps);

        const val = maxVal - deltaVal;
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
    console.log(effect);
    const body = document.getElementById("body");
    body.innerHTML = ""; // clear

    // white out
    body.classList.add("white");
    await new Promise(r => setTimeout(r, 300));
    body.classList.remove("white")

    if (effect) {
        try {
            await effect.apply(this);
        } catch (ex) {
            console.error(ex); // idc
        }

    }

    await new Promise(r => setTimeout(r, 200));
    const nextQ = questions.pop();
    if (nextQ) {
        document.getElementById("q-label").innerText = nextQ.label;
        await new Promise(r => setTimeout(r, 100));


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
    } else {
        window.location = window.location.toString().split("/").slice(0, -1).join("/") + "/windex.html" 
    }

}

addEventListener("DOMContentLoaded", (win, ev) => {
    // loadMultipleChoice();
});