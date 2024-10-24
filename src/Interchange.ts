import { Choice } from "./Choice.js";

export class Interchange {
    element: HTMLElement;
    choices: Array<Choice>;

    constructor(public svgns: any) {
        this.choices = new Array();

        this.element = this.rectangle(80, 40);
        this.element.onpointerdown = () => {
            console.log(`pointer down`);
        };
    }

    rectangle(width: number, height: number): HTMLElement {
        const rect = document.createElementNS(this.svgns, "rect");
        rect.setAttribute("width", width.toString());
        rect.setAttribute("height", height.toString());
        rect.setAttribute("style", "fill:red;stroke:black;stroke-width:2;margin:10px;padding:10;");
        return rect;
    }
}