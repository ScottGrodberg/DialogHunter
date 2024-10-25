import { Choice } from "./Choice.js";

export class Interchange {
    element: HTMLElement;
    header: HTMLElement;
    body: HTMLElement;
    choices: Array<Choice>;
    ptrDown: (event: any) => void;
    ptrMove: (event: any) => void;
    ptrUp: (event: any) => void;

    constructor() {
        this.choices = new Array();

        this.element = document.createElement("div");
        this.element.style.width = "80px";
        this.element.style.height = "150px";
        this.element.style.padding = "10px";
        this.element.style.backgroundColor = "black";
        this.element.style.position = "absolute";
        this.element.style.left = "100px";
        this.element.style.top = "100px";

        this.header = document.createElement("div");
        this.header.style.width = "80px";
        this.header.style.height = "30px";
        this.header.style.backgroundColor = "blue";
        this.header.style.cursor = "pointer";

        this.body = document.createElement("div");
        this.body.style.width = "80px";
        this.body.style.height = "120px";
        this.body.style.backgroundColor = "red";

        // Attach the pointerdown event listener to the SVG elements
        this.ptrDown = this.onPointerDown.bind(this);
        this.ptrMove = this.onPointerMove.bind(this);
        this.ptrUp = this.onPointerUp.bind(this);

        this.header.addEventListener('pointerdown', this.ptrDown);

        this.element.appendChild(this.header);
        this.element.appendChild(this.body);
    }

    // Function to handle the start of the drag
    onPointerDown(event: any) {
        const element = event.target;
        element.setPointerCapture(event.pointerId);
        element.addEventListener('pointermove', this.ptrMove);
        element.addEventListener('pointerup', this.ptrUp);
        element.dataset.startX = event.clientX;
        element.dataset.startY = event.clientY;
        element.dataset.initX = parseFloat(this.element.style.left) || 0;
        element.dataset.initY = parseFloat(this.element.style.top) || 0;
    }

    // Function to handle the movement during drag
    onPointerMove(event: any) {
        const element = event.target;
        const deltaX = event.clientX - element.dataset.startX;
        const deltaY = event.clientY - element.dataset.startY;
        const newX = parseFloat(element.dataset.initX) + deltaX;
        const newY = parseFloat(element.dataset.initY) + deltaY;
        this.element.style.left = newX + "px";
        this.element.style.top = newY + "px";
    }

    // Function to handle the end of the drag
    onPointerUp(event: any) {
        const element = event.target;
        element.releasePointerCapture(event.pointerId);
        element.removeEventListener('pointermove', this.ptrMove);
        element.removeEventListener('pointerup', this.ptrUp);
    }


}