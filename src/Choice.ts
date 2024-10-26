export class Choice {
    element: HTMLElement;

    constructor() {
        this.element = document.createElement("div");
        this.element.style.display = "flex";
        this.element.style.flexDirection = "row";
        this.element.style.position = "relative";

        const socket = document.createElement("div");
        socket.style.borderRadius = "50%";
        socket.style.backgroundColor = "white";
        socket.style.width = "14px";
        socket.style.height = "14px";
        socket.style.position = "absolute";
        socket.style.border = "1px solid black";
        socket.style.top = "10px";
        socket.style.cursor = "pointer";

        const socketLeft = socket.cloneNode() as HTMLElement;
        socketLeft.style.left = "-18px";
        const socketRight = socket.cloneNode() as HTMLElement;
        socketRight.style.left = "calc(100% + 2px)";

        const key = document.createElement("input");
        key.style.width = "20%";

        const value = document.createElement("textarea");
        value.style.width = "60%";
        value.style.resize = "vertical";

        const x = document.createElement("button");
        x.innerHTML = "X";
        x.style.width = "20%"
        x.onclick = (event: MouseEvent) => {
            (event.target as HTMLElement).parentElement!.remove();
        };

        this.element.appendChild(socketLeft);
        this.element.appendChild(key);
        this.element.appendChild(value);
        this.element.appendChild(x);
        this.element.appendChild(socketRight);
    }
}