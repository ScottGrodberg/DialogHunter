import { ChoiceMaker } from "./ChoiceMaker.js";
import { Connector } from "./Connector.js";
import { CurrentNode } from "./CurrentNode.js";
import { Data, NodeId, SocketsConnection } from "./Data.js";
import { Node } from "./Node.js";
import { NodeEditor } from "./NodeEditor.js";
import { NodeLayout } from "./NodeLayout.js";
import { RowMaker } from "./RowMaker.js";
import { Utility } from "./Utility.js";

const svgns = "http://www.w3.org/2000/svg";

// Entry point
window.addEventListener("DOMContentLoaded", () => {
    const main = new Main();
});

// App-wide styles, should prob just be element selectors here
const style = document.createElement('style');
style.innerHTML = `
    button {
        cursor: pointer;
        user-select: none;
    }
`;
document.head.appendChild(style);


export class Main {

    constructor() {
        // Begin composition root
        const data = new Data();
        const utility = new Utility();
        const connector = new Connector(data);
        const rowMaker = new RowMaker(connector, utility);
        const currentNode = new CurrentNode(data);
        const choiceMaker = new ChoiceMaker(data, rowMaker, currentNode);
        const nodeLayout = new NodeLayout(rowMaker, utility, data, choiceMaker, currentNode, connector);
        const nodeEditor = new NodeEditor(rowMaker, utility, data, choiceMaker);

        this.composeLayout(data, utility, nodeLayout, currentNode);
        this.composeEditor(data, nodeEditor);

        connector.init();

    }

    composeLayout(data: Data, utility: Utility, nodeMaker: NodeLayout, currentNode: CurrentNode) {

        // Layout wrapper
        const divLayoutWrapper = document.createElement("div");
        divLayoutWrapper.id = "div-layout-wrapper";
        divLayoutWrapper.style.height = "50%";
        divLayoutWrapper.style.overflow = "scroll";
        data.divLayoutWrapper = divLayoutWrapper;

        // Layout inner
        const divLayout = document.createElement("div");
        divLayout.id = "div-layout";
        divLayout.style.width = "2000px";
        divLayout.style.height = "1000px";
        divLayout.style.position = "relative";
        data.divLayout = divLayout;

        // Svg
        const svgLayout = document.createElementNS(svgns, "svg");
        svgLayout.id = "svg-layout";
        svgLayout.setAttribute("width", "100%");
        svgLayout.setAttribute("height", "100%");
        data.svgLayout = svgLayout;

        // Add new node button
        const buttonNew = document.createElement("button");
        buttonNew.id = "button-new-node";
        buttonNew.innerHTML = "+";
        buttonNew.style.position = "fixed";
        buttonNew.style.zIndex = "1";
        buttonNew.style.top = "20px";
        buttonNew.style.left = "20px";
        buttonNew.onclick = () => this.newNode(nodeMaker, utility, data);
        divLayout.appendChild(buttonNew);

        // Start with one interchange
        const nodeFirst = this.newNode(nodeMaker, utility, data);
        nodeFirst.style.top = "66px";
        nodeFirst.style.left = "100px";
        data.head = nodeFirst.dataset.nodeId;

        // "Current node" indicator
        const arrow = currentNode.makeCurrentArrow();

        // Element composition
        divLayout.appendChild(svgLayout);
        divLayoutWrapper.appendChild(divLayout);
        document.body.appendChild(divLayoutWrapper);
    }

    composeEditor(data: Data, nodeEditor: NodeEditor) {
        // Editor wrapper
        const divEditorWrapper = document.createElement("div");
        divEditorWrapper.id = "div-Editor-wrapper";
        divEditorWrapper.style.height = "50%";
        data.divEditorWrapper = divEditorWrapper;

        const nodeEditorElement = nodeEditor.makeEditor();

        // Element composition
        divEditorWrapper.appendChild(nodeEditorElement);
        document.body.appendChild(divEditorWrapper);
    }


    newNode(nodeLayout: NodeLayout, utility: Utility, data: Data): HTMLElement {
        const divLayout = data.divLayout!;
        const divLayoutWrapper = data.divLayoutWrapper!;

        const node = new Node(utility.generateUid(8));

        // Add to ui
        const element = nodeLayout.node(node.nodeId);
        const left = divLayoutWrapper.scrollLeft + divLayoutWrapper.offsetWidth * 0.5 + Math.random() * 100 - 50 - NodeLayout.DEFAULT_WIDTH * 0.5;
        const top = divLayoutWrapper.scrollTop + divLayoutWrapper.offsetHeight * 0.5 + Math.random() * 100 - 50 - NodeLayout.DEFAULT_WIDTH * 0.5;
        element.style.left = left + "px";
        element.style.top = top + "px";
        divLayout.appendChild(element);

        // Add to data
        data.nodes.set(node.nodeId, node);
        if (data.incoming.has(node.nodeId) || data.outgoing.has(node.nodeId)) {
            throw new Error(`Unexpected duplicate nodeId`);
        }
        data.incoming.set(node.nodeId, new Map<NodeId, SocketsConnection>());
        data.outgoing.set(node.nodeId, new Map<NodeId, SocketsConnection>());

        return element;
    }

}