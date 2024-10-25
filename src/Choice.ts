export class Choice {
    element: HTMLElement;

    constructor() {
        this.element = document.createElement("div");
        this.element.style.display = "flex";
        this.element.style.flexDirection = "row";

        const key = document.createElement("input");
        const value = document.createElement("p");
        const x = document.createElement("button");

        this.element.appendChild(key);
        this.element.appendChild(value);
        this.element.appendChild(x);
    }
}