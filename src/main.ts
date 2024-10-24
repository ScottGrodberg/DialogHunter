import { Interchange } from "./Interchange.js";


window.addEventListener("DOMContentLoaded", () => {
    const main = new Main();
    main.test();
});

export class Main {

    svgns: any;

    test() {
        const dep = new Interchange();
        dep.dep();

        // Create the SVG namespace
        this.svgns = "http://www.w3.org/2000/svg";

        // Create an SVG element
        const svg = document.createElementNS(this.svgns, "svg");
        svg.setAttribute("width", "200");
        svg.setAttribute("height", "100");
        document.body.appendChild(svg);


        const rect = this.rectangle(80, 40);
        rect.onpointerdown = () => {

        };

        svg.appendChild(rect);
    }

    rectangle(width: number, height: number) {
        const rect = document.createElementNS(this.svgns, "rect");
        rect.setAttribute("width", width.toString());
        rect.setAttribute("height", height.toString());
        rect.setAttribute("style", "fill:red;stroke:black;stroke-width:2;margin:10px;padding:10;");
        return rect;
    }

}
