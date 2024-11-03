import { Choice } from "./Choice.js";
import { ChoiceFor, ChoiceMaker } from "./ChoiceMaker.js";
import { Data } from "./Data.js";
import { RowMaker } from "./RowMaker.js";
import { Utility } from "./Utility.js";

export class NodeEditor {
    nodeId?: number;

    constructor(public rowMaker: RowMaker, public utility: Utility, public data: Data, public choiceMaker: ChoiceMaker) { }

    makeEditor(): HTMLDivElement {

        const element = document.createElement("div");
        element.id = "node-editor";
        element.style.width = "40%";
        element.style.padding = "10px";
        element.style.backgroundColor = "black";
        element.style.position = "absolute";
        element.style.left = "10%";
        element.style.boxShadow = "0 0 20px 9px rgba(0, 0, 0, 0.25)";
        element.style.display = "none";

        const header = document.createElement("div");
        header.id = "node-editor-header";
        header.style.backgroundColor = "blue";

        const row = this.rowMaker.row();
        const headerText = document.createElement("textarea");
        headerText.style.margin = "5px";
        headerText.style.width = "calc(100% - 10px)";
        headerText.onchange = (event: Event) => {
            const text = (event.target as HTMLTextAreaElement).value;
            this.data.nodes.get(this.data.currentNodeId!)!.text = text;
            const header = document.getElementById(`node-header-text-${this.data.currentNodeId}`)!;
            header.innerHTML = text;
        };
        row.append(headerText);
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

    makeOutput(): HTMLDivElement {
        const divOutputWrapper = document.createElement("div");
        divOutputWrapper.id = "div-output-wrapper";
        divOutputWrapper.style.position = "absolute";
        divOutputWrapper.style.right = "8%";
        divOutputWrapper.style.width = "34%";
        divOutputWrapper.style.height = "40%";
        divOutputWrapper.style.overflow = "scroll-y";

        const divOutput = document.createElement("div");
        divOutput.id = "div-output";

        const buttonCopy = document.createElement("button");
        buttonCopy.innerHTML = "Copy";
        buttonCopy.onclick = () => {
            var text = document.getElementById("div-output")!.innerHTML;
            navigator.clipboard.writeText(text);
        };

        divOutputWrapper.append(divOutput, buttonCopy);
        return divOutputWrapper;
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
        this.choiceMaker.update(this.data.currentNodeId!, destination, ChoiceFor.LAYOUT);
    }

}