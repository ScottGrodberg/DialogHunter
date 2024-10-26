import { Choice } from "./Choice.js";

export class Interchange {
    static DEFAULT_WIDTH = 150;
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
        this.element.style.width = Interchange.DEFAULT_WIDTH + "px";
        this.element.style.padding = "10px";
        this.element.style.backgroundColor = "black";
        this.element.style.position = "absolute";
        this.element.style.boxShadow = "0 0 20px 9px rgba(0, 0, 0, 0.25)";

        this.header = document.createElement("div");
        this.header.style.width = "100%";
        this.header.style.height = "30px";
        this.header.style.backgroundColor = "blue";
        this.header.style.cursor = "pointer";

        this.body = document.createElement("div");
        this.body.style.width = "100%";
        this.body.style.minHeight = "120px";
        this.body.style.backgroundColor = "red";

        // Attach the pointerdown event listener to the SVG elements
        this.ptrDown = this.onPointerDown.bind(this);
        this.ptrMove = this.onPointerMove.bind(this);
        this.ptrUp = this.onPointerUp.bind(this);

        this.header.addEventListener('pointerdown', this.ptrDown);

        const buttonAdd = document.createElement("button");
        buttonAdd.innerHTML = "+";
        buttonAdd.style.border = "1px solid black";
        buttonAdd.onclick = () => {
            const choice = new Choice();
            this.choices.push(choice);
            this.body.insertBefore(choice.element, buttonAdd);
        };
        this.body.appendChild(buttonAdd);

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