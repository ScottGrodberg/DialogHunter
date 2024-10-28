import { ChoiceId, Data, NodeId } from "./Data";
import { RowMaker } from "./RowMaker";

export class ChoiceMaker {

    constructor(public data: Data, public rowMaker: RowMaker) { }

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

            // Delete the element
            const element = (event.target as HTMLElement).parentElement;
            const nodeId = element?.dataset.nodeId!;
            const choiceId = element!.dataset.choiceId!;
            element!.remove();

            // Delete the data
            const nodeIdTo = this.data.choices.get(choiceId)?.nodeId;
            this.data.choices.delete(choiceId);
            const node = this.data.nodes.get(nodeId)!;
            node.choices = node.choices.filter(_choiceId => _choiceId !== choiceId);

            // Delete the connection
            if (nodeIdTo) {
                const node = this.data.outgoing.get(nodeId)!;
                node.get(nodeIdTo)?.remove(); // remove the ilne
                node.delete(nodeIdTo); // delete the outgoing to connection                
            }
        };

        element.appendChild(socketLeft);
        element.appendChild(key);
        element.appendChild(value);
        element.appendChild(x);
        element.appendChild(socketRight);

        return element;
    }
}