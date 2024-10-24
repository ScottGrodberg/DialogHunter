import { Interchange } from "./Interchange.js";

let svgns: any;

window.addEventListener("DOMContentLoaded", () => {
    const main = new Main();
    main.test();
});

export class Main {


    test() {

        // Create the SVG namespace
        svgns = "http://www.w3.org/2000/svg";

        // Create an SVG element
        const svg = document.createElementNS(svgns, "svg");
        svg.setAttribute("width", "200");
        svg.setAttribute("height", "100");
        document.body.appendChild(svg);


        const interchange = new Interchange(svgns);
        svg.appendChild(interchange.element);

    }


}