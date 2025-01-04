import { Connector } from "./Connector";
import { CurrentNode } from "./CurrentNode";
import { ChoiceId, Data, NodeId } from "./Data";
import { RowMaker } from "./RowMaker";

export enum ChoiceFor {
    LAYOUT, EDITOR
}

export class ChoiceMaker {

    constructor(public data: Data, public rowMaker: RowMaker, public currentNode: CurrentNode, public connector: Connector) { }

    choiceForLayout(nodeId: NodeId, choiceId: ChoiceId): SVGElement {

        const element = this.makeLayoutRow(nodeId, choiceId);

        const { socketLeft, socketRight } = this.rowMaker.sockets(nodeId, choiceId);

        const value = this.makeResponseReadOnly(choiceId);
        value.style.width = "100%";

        element.append(socketLeft, value, socketRight);

        return element;
    }

    choiceForEditor(nodeId: NodeId, choiceId: ChoiceId): HTMLElement {

        const element = this.makeEditorRow(nodeId, choiceId);

        const key = this.makeKey();
        key.style.width = "30px";

        const value = this.makeResponse(choiceId);
        value.style.width = "calc(100% - 30px - 30px)";

        const x = this.makeX();
        x.style.width = "30px";

        const arrow = this.makeNextArrow(choiceId);
        arrow.style.width = "30px";

        //element.append(key,value,x);
        element.append(x, value, arrow);

        return element;
    }

    makeLayoutRow(nodeId: NodeId, choiceId: ChoiceId): SVGElement {
        const element = this.rowMaker.layoutRow();
        const rect = element.children[0] as SVGRectElement;
        const fillColor = window.getComputedStyle(document.documentElement).getPropertyValue('--node-body-background');
        rect.setAttribute("fill", fillColor);
        this.decorateIdAndData(element, nodeId, choiceId);
        return element;
    }

    makeEditorRow(nodeId: NodeId, choiceId: ChoiceId): HTMLElement {
        const element = this.rowMaker.editorRow();
        this.decorateIdAndData(element, nodeId, choiceId);
        return element;
    }

    decorateIdAndData(element: HTMLElement | SVGElement, nodeId: NodeId, choiceId: ChoiceId) {
        element.id = "choice-" + choiceId;
        element.dataset.nodeId = nodeId;
        element.dataset.choiceId = choiceId;
    }

    makeKey() {
        const key = document.createElement("input");
        key.oninput = (event: Event) => {
            const element = (event.target as HTMLInputElement);
            element.value = element.value.substring(0, 1);
        };
        return key;
    }

    makeResponse(choiceId: ChoiceId) {
        const response = document.createElement("textarea");
        response.style.resize = "vertical";
        response.innerHTML = this.data.choices.get(choiceId)!.text!;
        response.title = response.innerHTML;
        response.onchange = () => {
            this.data.choices.get(choiceId)!.text = response.value;
            const destination = document.getElementById(`node-body-${this.data.currentNodeId}`)!;
            this.changeResponseText(destination);
        };
        return response;
    }

    changeResponseText(destination: HTMLElement) {
        this.update(this.data.currentNodeId!, destination, ChoiceFor.LAYOUT);
    }

    makeResponseReadOnly(choiceId: ChoiceId): SVGElement {
        const response = document.createElementNS(this.data.SVGNS, "text") as SVGElement;
        response.innerHTML = this.data.choices.get(choiceId)!.text!;
        response.setAttribute("x", "0");
        response.setAttribute("y", "17");
        response.style.width = this.data.NODE_WIDTH + "px";
        response.style.height = "2.5em";
        return response;
    }

    makeNextArrow(choiceId: ChoiceId) {
        const arrow = document.createElement("button");
        arrow.innerHTML = ">";

        // determine if there is an outgoing connection from this choice
        // If there is then show the arrow
        if (this.data.choices.get(choiceId)?.nodeId) {
            arrow.style.visibility = "visible";
        } else {
            arrow.style.visibility = "hidden";
        }

        arrow.onclick = (event: MouseEvent) => {

            const nodeId = this.data.choices.get(choiceId)?.nodeId;
            console.log(`Choice ${choiceId} clicked arrow, next node is ${nodeId}`);
            if (!nodeId) {
                return;
            }
            this.changeNode(nodeId);

            this.roll(nodeId);

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
                // Delete the outgoing connection                
                const nodeOut = this.data.outgoing.get(nodeId)!;
                nodeOut.get(nodeIdTo)!.path.remove(); // remove the path
                nodeOut.delete(nodeIdTo);

                // Delete the incoming connection
                const nodeIn = this.data.incoming.get(nodeIdTo)!;
                nodeIn.get(nodeId)!.path.remove(); // remove the path
                nodeIn.delete(nodeId);
            }

            const destination = document.getElementById(`node-body-${nodeId}`)!;
            this.deleteResponse(destination, nodeId);
        };
        return x;
    }

    deleteResponse(destination: HTMLElement, nodeId: NodeId) {
        this.update(nodeId, destination, ChoiceFor.LAYOUT);
    }

    /**
     * Update the ui of the given node, redrawing choice rows and rewiring outgoing connections
     * @param nodeId 
     */
    update(nodeId: NodeId, destination: HTMLElement, choiceFor: ChoiceFor) {

        // Clear all rows from the body
        destination.innerHTML = ``;

        const node = this.data.nodes.get(nodeId)!;
        const choices = node.choices;
        let i = 1;
        choices.forEach(choice => {
            let element: Element;
            if (choiceFor === ChoiceFor.LAYOUT) {
                element = this.choiceForLayout(nodeId, choice);
            } else {
                element = this.choiceForEditor(nodeId, choice);
            }
            element.setAttribute("y", `${i * 40}`);
            destination.appendChild(element);
            i++;
        })

        // Socket elements were blown away when destination.innerHTML unset.
        // This rewires the connecting paths
        if (choiceFor == ChoiceFor.LAYOUT) {
            this.connector.connectNode(node)
        }

        this.data.dump();
    }

    changeNode(nodeId: NodeId) {

        // Update the header
        const text = this.data.nodes.get(nodeId)!.text!;
        const header = document.getElementById(`node-editor-header`)!;
        header.getElementsByTagName("textarea").item(0)!.value = text;

        // Update the responses
        const destination = document.getElementById(`node-editor-body`)!;
        this.update(nodeId, destination, ChoiceFor.EDITOR);

        // Show the node
        document.getElementById("node-editor")!.style.display = "block";

        this.currentNode.setCurrentNode(nodeId);
    }

    roll(nodeId: NodeId) {
        const node = this.data.nodes.get(nodeId)!;
        if (!node.text.startsWith("ROLL")) {
            return;
        }
        const t = node.text.match(/T=(\d{1,2})/)!;
        const i = Math.ceil(Math.random() * 100);
        // FIXME: This works on a hardcoded choice ordinal, 0 or 1.
        //        0 is assumed to be the gte eval, 1 is assumed to be the lt eval
        let nodeIdNext: NodeId;
        if (i >= parseInt(t[1])) {
            nodeIdNext = this.data.choices.get(node.choices[0])!.nodeId!;
        } else {
            nodeIdNext = this.data.choices.get(node.choices[1])!.nodeId!;
        }
        this.changeNode(nodeIdNext);
    }
}