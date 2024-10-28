import { ChoiceId, NodeId } from "./Data";
import { RowMaker } from "./RowMaker";

export class ChoiceMaker {

    constructor(public rowMaker: RowMaker) { }

    choice(nodeId: NodeId, choiceId: ChoiceId): HTMLDivElement {

        const element = this.rowMaker.row();
        element.id = "choice-" + choiceId;
        element.dataset.nodeId = nodeId;
        element.dataset.choiceId = choiceId;

        const { socketLeft, socketRight } = this.rowMaker.sockets(nodeId, choiceId);

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

        element.appendChild(socketLeft);
        element.appendChild(key);
        element.appendChild(value);
        element.appendChild(x);
        element.appendChild(socketRight);

        return element;
    }
}