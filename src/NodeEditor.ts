import { Choice } from "./Choice.js";
import { ChoiceFor, ChoiceMaker } from "./ChoiceMaker.js";
import { Data } from "./Data.js";
import { NodeLayout } from "./NodeLayout.js";
import { RowMaker } from "./RowMaker.js";
import { Utility } from "./Utility.js";

export class NodeEditor {
    nodeId?: number;

    constructor(public rowMaker: RowMaker, public utility: Utility, public data: Data, public choiceMaker: ChoiceMaker, public nodeLayout: NodeLayout) { }

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
        divOutput.style.whiteSpace = "pre";
        divOutput.style.overflow = "scroll";
        divOutput.style.height = "100%";

        const buttonCopy = document.createElement("button");
        buttonCopy.innerHTML = "Copy";
        buttonCopy.onclick = () => {
            var text = document.getElementById("div-output")!.innerHTML;
            navigator.clipboard.writeText(text);
        };

        const buttonSave = document.createElement("button");
        buttonSave.innerHTML = "Save";
        buttonSave.onclick = () => {
            this.saveToStorage();
        };

        const buttonLoad = document.createElement("button");
        buttonLoad.innerHTML = "Load";
        buttonLoad.onclick = () => {
            this.loadFromStorage();
        };


        divOutputWrapper.append(divOutput, buttonCopy, buttonSave, buttonLoad);
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

    saveToStorage() {
        localStorage.setItem("nodes", JSON.stringify(Array.from(this.data.nodes.entries())));
        localStorage.setItem("choices", JSON.stringify(Array.from(this.data.choices.entries())));
    }

    loadFromStorage() {

        this.data.nodes.forEach(node => {
            const element = document.getElementById(`node-${node.nodeId}`);
            element?.remove();
        });

        this.data.nodes = new Map(JSON.parse(localStorage.getItem("nodes")!));
        this.data.choices = new Map(JSON.parse(localStorage.getItem("choices")!));

        // Update the UI put all nodes and choices into the layout window
        this.data.nodes.forEach(node => {

            // add the node to the layout
            const element = this.nodeLayout.node(node.nodeId);
            element.style.left = node.position!.left + "px";
            element.style.top = node.position!.top + "px";
            this.data.divLayout!.appendChild(element);

            // update the text of node
            const header = document.getElementById(`node-header-text-${node.nodeId}`)!;
            header.innerHTML = node.text!;

            // call the method to add the choices to the node
            const destination = document.getElementById(`node-body-${node.nodeId}`)!;
            this.choiceMaker.update(node.nodeId, destination, ChoiceFor.LAYOUT);
        });

    }
}