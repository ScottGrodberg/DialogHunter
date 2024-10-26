import { Interchange } from "./Interchange.js";

let svgns: any;

window.addEventListener("DOMContentLoaded", () => {
    const main = new Main();
    main.test();
});

export class Main {

    test() {

        // Create an SVG element
        const div = document.createElement("div");
        document.body.appendChild(div);

        const buttonNew = document.createElement("button");
        buttonNew.innerHTML = "+";
        buttonNew.onclick = () => {
            const interchange = new Interchange();
            div.appendChild(interchange.element);
        };
        div.appendChild(buttonNew);

        const interchange = new Interchange();
        div.appendChild(interchange.element);

    }


}