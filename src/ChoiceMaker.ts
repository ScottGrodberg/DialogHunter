import { CurrentNode } from "./CurrentNode";
import { ChoiceId, Data, NodeId } from "./Data";
import { RowMaker } from "./RowMaker";

export enum ChoiceFor {
    LAYOUT, EDITOR
}

export class ChoiceMaker {

    constructor(public data: Data, public rowMaker: RowMaker, public currentNode: CurrentNode) { }

    choiceForLayout(nodeId: NodeId, choiceId: ChoiceId): HTMLDivElement {

        const element = this.makeRow(nodeId, choiceId);

        const { socketLeft, socketRight } = this.rowMaker.sockets(nodeId, choiceId);

        const value = this.makeSentenceReadOnly(choiceId);
        value.style.width = "100%";

        element.append(socketLeft, value, socketRight);

        return element;
    }

    choiceForEditor(nodeId: NodeId, choiceId: ChoiceId): HTMLDivElement {

        const element = this.makeRow(nodeId, choiceId);

        const key = this.makeKey();
        key.style.width = "30px";

        const value = this.makeSentence(choiceId);
        value.style.width = "calc(100% - 30px - 30px)";

        const x = this.makeX();
        x.style.width = "30px";

        const arrow = this.makeArrow(choiceId);
        arrow.style.width = "30px";

        //element.append(key,value,x);
        element.append(x, value, arrow);

        return element;
    }

    makeRow(nodeId: NodeId, choiceId: ChoiceId) {
        const element = this.rowMaker.row();
        element.id = "choice-" + choiceId;
        element.dataset.nodeId = nodeId;
        element.dataset.choiceId = choiceId;
        return element;
    }

    makeKey() {
        const key = document.createElement("input");
        key.oninput = (event: Event) => {
            const element = (event.target as HTMLInputElement);
            element.value = element.value.substring(0, 1);
        };
        return key;
    }

    makeSentence(choiceId: ChoiceId) {
        const sentence = document.createElement("textarea");
        sentence.style.resize = "vertical";
        sentence.innerHTML = this.data.choices.get(choiceId)!.sentence!;
        sentence.onchange = () => {
            this.data.choices.get(choiceId)!.sentence = sentence.value;
        };
        return sentence;
    }

    makeSentenceReadOnly(choiceId: ChoiceId) {
        const sentence = document.createElement("p");
        sentence.innerHTML = this.data.choices.get(choiceId)!.sentence!;
        return sentence;
    }

    makeArrow(choiceId: ChoiceId) {
        const arrow = document.createElement("button");
        arrow.innerHTML = ">";
        arrow.onclick = (event: MouseEvent) => {

            const nextNodeId = this.data.choices.get(choiceId)?.nodeId;
            console.log(`Choice ${choiceId} clicked arrow, next node is ${nextNodeId}`);
            if (!nextNodeId) {
                return;
            }
            const destination = document.getElementById(`node-editor-body`)!;
            this.update(nextNodeId, destination, ChoiceFor.EDITOR);
            this.currentNode.setCurrentNode(nextNodeId);
        };
        return arrow;
    }

    makeX() {
        const x = document.createElement("button");
        x.innerHTML = "X";
        x.onclick = (event: MouseEvent) => {

            // Delete the element
            const element = (event.target as HTMLElement).parentElement;
            const nodeId = element!.dataset.nodeId!;
            const choiceId = element!.dataset.choiceId!;
            element!.remove();

            // Delete the data
            const nodeIdTo = this.data.choices.get(choiceId)!.nodeId;
            this.data.choices.delete(choiceId);
            const node = this.data.nodes.get(nodeId)!;
            node.choices = node.choices.filter(_choiceId => _choiceId !== choiceId);

            // Delete the connection
            if (nodeIdTo) {
                const node = this.data.outgoing.get(nodeId)!;
                node.get(nodeIdTo)!.remove(); // remove the ilne
                node.delete(nodeIdTo); // delete the outgoing connection                
            }

            const destination = document.getElementById(`node-body-${nodeId}`)!;
            this.update(nodeId, destination, ChoiceFor.LAYOUT);
        };
        return x;
    }
    /**
     * Create or update rows for the given node. Called after the data has been changed and needs to be reflected in the ui
     * @param nodeId 
     */
    update(nodeId: NodeId, destination: HTMLElement, choiceFor: ChoiceFor) {

        // Clear all rows from the body
        destination.innerHTML = ``;

        const node = this.data.nodes.get(nodeId)!;
        const choices = node.choices;
        choices.forEach(choice => {
            let element: HTMLElement;
            if (choiceFor === ChoiceFor.LAYOUT) {
                element = this.choiceForLayout(nodeId, choice);
            } else {
                element = this.choiceForEditor(nodeId, choice);
            }
            destination.appendChild(element);
        })

    }
}