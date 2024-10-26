import { Interchange } from "./Interchange.js";

let svgns: any;

window.addEventListener("DOMContentLoaded", () => {
    const main = new Main();
    main.setup();
});

export class Main {

    setup() {
        const div = document.createElement("div");
        document.body.appendChild(div);

        const buttonNew = document.createElement("button");
        buttonNew.innerHTML = "+";
        buttonNew.onclick = () => {
            const interchange = new Interchange();
            div.appendChild(interchange.element);
        };
        div.appendChild(buttonNew);

        const interchange = new Interchange()
        interchange.element.style.left = "100px";
        interchange.element.style.top = "100px";
        div.appendChild(interchange.element);

    }


}