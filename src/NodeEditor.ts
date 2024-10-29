import { Choice } from "./Choice.js";
import { ChoiceMaker } from "./ChoiceMaker.js";
import { Data } from "./Data.js";
import { ChoiceFor, NodeUpdater } from "./NodeUpdater.js";
import { RowMaker } from "./RowMaker.js";
import { Utility } from "./Utility.js";

export class NodeEditor {
    nodeId?: number;

    constructor(public rowMaker: RowMaker, public utility: Utility, public data: Data, public choiceMaker: ChoiceMaker, public nodeUpdater: NodeUpdater) { }

    makeEditor(): HTMLDivElement {

        const element = document.createElement("div");
        element.id = "node-editor";
        element.style.width = "50%";
        element.style.padding = "10px";
        element.style.backgroundColor = "black";
        element.style.position = "absolute";
        element.style.left = "200px";
        element.style.boxShadow = "0 0 20px 9px rgba(0, 0, 0, 0.25)";

        const header = document.createElement("div");
        header.id = "node-editor-header";
        header.style.width = "100%";
        header.style.height = "30px";
        header.style.backgroundColor = "blue";

        const row = this.rowMaker.row();
        header.appendChild(row);

        const body = document.createElement("div");
        body.id = "node-editor-body";
        body.style.width = "100%";
        body.style.minHeight = "120px";
        body.style.backgroundColor = "red";

        const footer = document.createElement("div");
        footer.id = "node-editor-footer";
        footer.style.width = "100%";
        footer.style.backgroundColor = "green";

        const buttonAdd = document.createElement("button");
        buttonAdd.innerHTML = "+";
        buttonAdd.style.border = "1px solid black";
        buttonAdd.onclick = () => this.addChoice(body);
        footer.appendChild(buttonAdd);

        element.appendChild(header);
        element.appendChild(body);
        element.appendChild(footer);

        return element;
    }

    addChoice(body: HTMLElement) {
        // data
        const choice = new Choice(this.utility.generateUid(8));
        this.data.choices.set(choice.choiceId, choice);
        this.data.nodes.get(this.data.currentNodeId!)!.choices.push(choice.choiceId);

        // add the choice to the editor
        const element = this.choiceMaker.choiceForEditor(this.data.currentNodeId!, choice.choiceId);
        body.append(element);

        // add the choice to the node in layout
        const destination = document.getElementById(`node-body-${this.data.currentNodeId}`)!;
        this.nodeUpdater.update(this.data.currentNodeId!, destination, ChoiceFor.LAYOUT);
    }

}