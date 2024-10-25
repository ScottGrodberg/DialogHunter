import { Choice } from "./Choice.js";

export class Interchange {
    element: HTMLElement;
    choices: Array<Choice>;
    ptrDown: (event: any) => void;
    ptrMove: (event: any) => void;
    ptrUp: (event: any) => void;

    constructor(public svgns: any) {
        this.choices = new Array();


        this.element = document.createElementNS(this.svgns, "rect");
        this.element.setAttribute("width", "80");
        this.element.setAttribute("height", "40");
        this.element.setAttribute("style", "fill:red");

        // Attach the pointerdown event listener to the SVG elements
        this.ptrDown = this.onPointerDown.bind(this);
        this.ptrMove = this.onPointerMove.bind(this);
        this.ptrUp = this.onPointerUp.bind(this);

        this.element.addEventListener('pointerdown', this.ptrDown);
    }

    rectangle(width: number, height: number): HTMLElement {
        const rect = document.createElementNS(this.svgns, "rect");
        rect.setAttribute("width", width.toString());
        rect.setAttribute("height", height.toString());
        rect.setAttribute("style", "fill:red;stroke:black;stroke-width:2;margin:10px;padding:10;");
        return rect;
    }

    // Function to handle the start of the drag
    onPointerDown(event: any) {
        const element = event.target;
        element.setPointerCapture(event.pointerId);
        element.addEventListener('pointermove', this.ptrMove);
        element.addEventListener('pointerup', this.ptrUp);
        element.dataset.startX = event.clientX;
        element.dataset.startY = event.clientY;
        element.dataset.initX = parseFloat(element.getAttribute('x')) || 0;
        element.dataset.initY = parseFloat(element.getAttribute('y')) || 0;
    }

    // Function to handle the movement during drag
    onPointerMove(event: any) {
        const element = event.target;
        const deltaX = event.clientX - element.dataset.startX;
        const deltaY = event.clientY - element.dataset.startY;
        const newX = parseFloat(element.dataset.initX) + deltaX;
        const newY = parseFloat(element.dataset.initY) + deltaY;

        if (element.tagName === 'rect') {
            element.setAttribute('x', newX);
            element.setAttribute('y', newY);
        }
        // else if (element.tagName === 'circle') {
        //     element.setAttribute('cx', newX);
        //     element.setAttribute('cy', newY);
        // }
    }

    // Function to handle the end of the drag
    onPointerUp(event: any) {
        const element = event.target;
        element.releasePointerCapture(event.pointerId);
        element.removeEventListener('pointermove', this.ptrMove);
        element.removeEventListener('pointerup', this.ptrUp);
    }


}