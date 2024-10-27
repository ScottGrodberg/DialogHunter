import { Connector } from "./Connector";
import { RowMaker } from "./RowMaker";
import { Utility } from "./Utility";

export class Choice {
    element: HTMLElement;
    id: string;

    constructor(public connector: Connector, public rowMaker: RowMaker, public utility: Utility, public nodeId: string) {
        this.id = utility.generateUid(8);

        this.element = rowMaker.row();

        const { socketLeft, socketRight } = rowMaker.sockets(nodeId, this.id);

        const key = document.createElement("input");
        key.style.width = "20%";
        key.oninput = (event: Event) => {
            const element = (event.target as HTMLInputElement);
            element.value = element.value.substring(0, 1);
        };

        const value = document.createElement("textarea");
        value.style.width = "60%";
        value.style.resize = "vertical";

        const x = document.createElement("button");
        x.innerHTML = "X";
        x.style.width = "20%";
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