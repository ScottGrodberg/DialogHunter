import { Choice } from "./Choice.js";
import { ChoiceFor, ChoiceMaker } from "./ChoiceMaker.js";
import { CurrentNode } from "./CurrentNode.js";
import { Data, NodeId, SocketsConnection } from "./Data.js";
import { LineMaker } from "./LineMaker.js";
import { NodeLayout } from "./NodeLayout.js";
import { RowMaker } from "./RowMaker.js";
import { Utility } from "./Utility.js";

export class NodeEditor {
    nodeId?: number;

    constructor(public rowMaker: RowMaker, public utility: Utility, public data: Data, public choiceMaker: ChoiceMaker, public currentNode: CurrentNode, public nodeLayout: NodeLayout, public lineMaker: LineMaker) { }

    makeEditor(): HTMLDivElement {

        const element = document.createElement("div");
        element.id = "node-editor";
        element.style.display = "none";

        const header = document.createElement("div");
        header.id = "node-editor-header";

        const row = this.rowMaker.row();
        const headerText = document.createElement("textarea");
        headerText.style.margin = "5px";
        headerText.style.width = "calc(100% - 10px)";
        headerText.onchange = (event: Event) => {
            const text = (event.target as HTMLTextAreaElement).value;

            if (text.startsWith("ROLL")) {
                if (!this.processRollNode(body, text)) {
                    return;
                }
            }

            // update the text
            this.data.nodes.get(this.data.currentNodeId!)!.text = text;
            const header = document.getElementById(`node-header-text-${this.data.currentNodeId}`)!;
            header.innerHTML = text;
            header.title = text;
            this.data.dump();
        };
        row.append(headerText);
        header.appendChild(row);

        const body = document.createElement("div");
        body.id = "node-editor-body";

        const footer = document.createElement("div");
        footer.id = "node-editor-footer";

        const buttonAdd = document.createElement("button");
        buttonAdd.innerHTML = "+ Add Choice";
        buttonAdd.style.margin = "0 0 3px 5px";
        buttonAdd.onclick = () => this.addChoice(body, "Change this text");
        footer.appendChild(buttonAdd);

        element.appendChild(header);
        element.appendChild(body);
        element.appendChild(footer);

        return element;
    }

    makeSidebar(): HTMLDivElement {
        const div = document.createElement("div");
        div.style.margin = "20px 0 0 20px";
        const buttonDelete = document.createElement("button");
        buttonDelete.innerHTML = "X Delete Node";
        buttonDelete.onclick = () => {
            this.deleteNode();
        };
        div.append(buttonDelete);
        return div;
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

    addChoice(body: HTMLElement, text: string): HTMLElement {
        // data
        const choice = new Choice(this.utility.generateUid(8), text);
        this.data.choices.set(choice.choiceId, choice);
        this.data.nodes.get(this.data.currentNodeId!)!.choices.push(choice.choiceId);

        // add the choice to the editor
        const element = this.choiceMaker.choiceForEditor(this.data.currentNodeId!, choice.choiceId);
        body.append(element);

        // add the choice to the node in layout
        const destination = document.getElementById(`node-body-${this.data.currentNodeId}`)!;
        this.choiceMaker.update(this.data.currentNodeId!, destination, ChoiceFor.LAYOUT);

        return element;
    }

    saveToStorage() {
        localStorage.setItem("nodes", JSON.stringify(Array.from(this.data.nodes.entries())));
        localStorage.setItem("choices", JSON.stringify(Array.from(this.data.choices.entries())));
    }

    loadFromStorage() {
        // clear the dom
        this.data.nodes.forEach(node => {
            const element = document.getElementById(`node-${node.nodeId}`);
            element?.remove();
        });
        this.data.incoming.forEach(_map => {
            _map.forEach(_sc => {
                _sc.line.remove();
            });
        })

        // Load the basic data from storage
        this.data.nodes = new Map(JSON.parse(localStorage.getItem("nodes")!));
        this.data.choices = new Map(JSON.parse(localStorage.getItem("choices")!));

        // Update the UI put all nodes and choices into the layout window
        this.data.nodes.forEach(node => {

            // add the node to the layout
            const element = this.nodeLayout.node(node.nodeId);
            element.style.left = node.position!.left.toString();
            element.style.top = node.position!.top.toString();
            this.data.divLayout!.appendChild(element);

            // update the text of node
            const header = document.getElementById(`node-header-text-${node.nodeId}`)!;
            header.innerHTML = node.text!;
            header.title = node.text!;

            // call the method to add the choices to the node
            const destination = document.getElementById(`node-body-${node.nodeId}`)!;
            this.choiceMaker.update(node.nodeId, destination, ChoiceFor.LAYOUT);
        });

        // Reset the incoming and outgoing structures
        this.data.incoming.clear();
        this.data.outgoing.clear();
        this.data.nodes.forEach(node => {
            this.data.incoming.set(node.nodeId, new Map<NodeId, SocketsConnection>());
            this.data.outgoing.set(node.nodeId, new Map<NodeId, SocketsConnection>());
        });

        // For each choice linked to a node, create a corresponding incoming and outgoing record and draw the line
        this.data.nodes.forEach(node => {

            node.choices.forEach(choiceId => {
                const choice = this.data.choices.get(choiceId)!;
                if (!choice.nodeId) {
                    return; // no linkage
                }

                // get the from sockets
                const socketFromLeft = document.querySelector(`#choice-${choiceId} :nth-child(1)`) as HTMLElement;
                const socketFromRight = document.querySelector(`#choice-${choiceId} :nth-child(3)`) as HTMLElement;

                // get the to sockets
                const socketToLeft = document.querySelector(`#node-header-${choice.nodeId} div :nth-child(1)`) as HTMLElement;
                const socketToRight = document.querySelector(`#node-header-${choice.nodeId} div :nth-child(3)`) as HTMLElement;

                // Draw the line
                // FIXME: This assumes outgoing lines go from the right of the source node to the left of the incoming node
                socketToLeft.style.display = "block";
                const start = this.lineMaker.getSocketCenter(socketFromRight);
                const end = this.lineMaker.getSocketCenter(socketToLeft)!;
                const line = this.lineMaker.makeLine(start);
                line.setAttribute("x2", end.x.toString());
                line.setAttribute("y2", end.y.toString());
                this.data.svgLayout!.appendChild(line);

                // Create the incomign and outgoing records, storing the line and socket element refs
                this.data.incoming.get(choice.nodeId)!.set(node.nodeId, { socketFrom: socketFromRight, line, socketTo: socketToLeft });
                this.data.outgoing.get(node.nodeId)!.set(choice.nodeId, { socketFrom: socketFromRight, line, socketTo: socketToLeft });

            });
        });
    }

    /** Deletes the current node */
    deleteNode() {
        const nodeId = this.data.currentNodeId!;

        // Remove from layout dom
        this.deleteFromLayout(nodeId);

        // Remove from editor dom
        this.deleteFromEditor();

        // Remove from structures
        const node = this.data.nodes.get(nodeId)!;
        node.choices.forEach(choiceId => {
            this.data.choices.delete(choiceId);
        });
        this.data.nodes.delete(nodeId);

        // Unset refs
        if (this.data.head === nodeId) {
            this.data.head = undefined;
        }
        this.currentNode.unsetCurrentNode();

        // update output in editor pane
        this.data.dump();
    }

    deleteFromLayout(nodeId: NodeId) {

        this.data.incoming.get(nodeId)!.forEach(_sc => {
            _sc.line.remove();
        });
        this.data.incoming.delete(nodeId);
        this.data.outgoing.get(nodeId)!.forEach(_sc => {
            _sc.line.remove();
        });
        this.data.outgoing.delete(nodeId);
        const element = document.getElementById(`node-${nodeId}`)!;
        element.remove();
    }

    deleteFromEditor() {
        const header = document.querySelector(`#node-editor-header textarea`)! as HTMLTextAreaElement;
        header.value = ``;
        const destination = document.getElementById(`node-editor-body`)!;
        destination.innerHTML = ``;
        const editor = document.getElementById("node-editor")!;
        editor.style.display = "none";
    }

    processRollNode(body: HTMLElement, text: string): boolean {
        // The "random roll" feature is being prototyped and the text fields are being appropriated for this.
        // If its a roll, the text must be in this specific format.
        const m = text.match(/ROLL 1d100, T=(\d{1,2})/);
        if (!m) {
            console.error(`For a roll node, text must be in the format "ROLL 1d100, T=n" where n is an integer between 1 and 100 inclusive`);
            return false;
        }

        // Determine the threshold and create the conditions to evaluate
        const t = parseInt(m[1]);
        const choiceGte = this.addChoice(body, `>= ${t}`);
        choiceGte.getElementsByTagName("textarea")![0].setAttribute("disabled", "true");
        const choiceLt = this.addChoice(body, `< ${t}`);
        choiceLt.getElementsByTagName("textarea")![0].setAttribute("disabled", "true");

        return true;
    }

}