import { Choice } from "./Choice.js";
import { ChoiceMaker } from "./ChoiceMaker.js";
import { Data } from "./Data.js";
import { RowMaker } from "./RowMaker.js";
import { Utility } from "./Utility.js";

export class NodeEditor {
    nodeId?: number;

    constructor(public rowMaker: RowMaker, public utility: Utility, public data: Data, public choiceMaker: ChoiceMaker) { }

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
        header.style.width = "100%";
        header.style.height = "30px";
        header.style.backgroundColor = "blue";

        const row = this.rowMaker.row();
        header.appendChild(row);

        const body = document.createElement("div");
        body.style.width = "100%";
        body.style.minHeight = "120px";
        body.style.backgroundColor = "red";

        const buttonAdd = document.createElement("button");
        buttonAdd.innerHTML = "+";
        buttonAdd.style.border = "1px solid black";
        buttonAdd.onclick = () => {

            const choice = new Choice(this.utility.generateUid(8));
            this.data.choices.set(choice.choiceId, choice);
            this.data.nodes.get(this.data.currentNodeId!)!.choices.push(choice.choiceId);

            const element = this.choiceMaker.choiceForEditor(this.data.currentNodeId!, choice.choiceId);
            body.insertBefore(element, buttonAdd);

            this.data.update(this.data.currentNodeId!);
        };
        body.appendChild(buttonAdd);
        element.appendChild(header);
        element.appendChild(body);

        return element;
    }

}