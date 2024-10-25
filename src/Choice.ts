export class Choice {
    element: HTMLElement;

    constructor() {
        this.element = document.createElement("div");
        this.element.style.display = "flex";
        this.element.style.flexDirection = "row";

        const key = document.createElement("input");
        key.style.width = "20%";
        const value = document.createElement("textarea");
        value.style.width = "60%"
        const x = document.createElement("button");
        x.innerHTML = "X";
        x.style.width = "20%"
        x.onclick = (event: MouseEvent) => {
            (event.target as HTMLElement).parentElement!.remove();
        };

        this.element.appendChild(key);
        this.element.appendChild(value);
        this.element.appendChild(x);
    }
}