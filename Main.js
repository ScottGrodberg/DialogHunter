import { ChoiceMaker } from "./ChoiceMaker.js";
import { Connector } from "./Connector.js";
import { CurrentNode } from "./CurrentNode.js";
import { Data } from "./Data.js";
import { LineMaker } from "./LineMaker.js";
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
    p { 
        margin: 0 0 0.8em 0;
        line-height:1.3;
        height:2.5em;
        padding: 0 0.2em;
        overflow:hidden;

        /* ellipsis after two lines */
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
    }
`;
document.head.appendChild(style);
export class Main {
    constructor() {
        // Begin composition root
        const data = new Data();
        const utility = new Utility();
        const lineMaker = new LineMaker(data);
        const connector = new Connector(data, lineMaker);
        const rowMaker = new RowMaker(connector, utility);
        const currentNode = new CurrentNode(data);
        const choiceMaker = new ChoiceMaker(data, rowMaker, currentNode);
        const nodeLayout = new NodeLayout(rowMaker, utility, data, choiceMaker, currentNode, connector, lineMaker);
        const nodeEditor = new NodeEditor(rowMaker, utility, data, choiceMaker, nodeLayout, lineMaker);
        this.composeLayout(data, utility, nodeLayout, currentNode);
        this.composeEditor(data, nodeEditor);
        connector.init();
    }
    composeLayout(data, utility, nodeMaker, currentNode) {
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
        // "Current node" indicator
        const arrow = currentNode.makeCurrentArrow();
        // Element composition
        divLayout.appendChild(svgLayout);
        divLayoutWrapper.appendChild(divLayout);
        document.body.appendChild(divLayoutWrapper);
        // Start with one interchange
        const nodeFirst = this.newNode(nodeMaker, utility, data);
        data.head = nodeFirst.dataset.nodeId;
        // Special starting position for first node only
        const node = data.nodes.get(data.head);
        node.position = { top: 66, left: 100 };
        nodeFirst.style.top = node.position.top + "px";
        nodeFirst.style.left = node.position.top + "px";
    }
    composeEditor(data, nodeEditor) {
        // Editor wrapper
        const divEditorWrapper = document.createElement("div");
        divEditorWrapper.id = "div-editor-wrapper";
        divEditorWrapper.style.height = "50%";
        data.divEditorWrapper = divEditorWrapper;
        const divSidebar = nodeEditor.makeSidebar();
        const divOutput = nodeEditor.makeOutput();
        const nodeEditorElement = nodeEditor.makeEditor();
        // Element composition
        divEditorWrapper.append(divSidebar, nodeEditorElement, divOutput);
        document.body.appendChild(divEditorWrapper);
    }
    newNode(nodeLayout, utility, data) {
        const divLayout = data.divLayout;
        const divLayoutWrapper = data.divLayoutWrapper;
        const node = new Node(utility.generateUid(8));
        const element = nodeLayout.node(node.nodeId);
        // Set the node's position
        const top = divLayoutWrapper.scrollTop + divLayoutWrapper.offsetHeight * 0.5 + Math.random() * 100 - 50 - NodeLayout.DEFAULT_WIDTH * 0.5;
        const left = divLayoutWrapper.scrollLeft + divLayoutWrapper.offsetWidth * 0.5 + Math.random() * 100 - 50 - NodeLayout.DEFAULT_WIDTH * 0.5;
        node.position = { top, left };
        element.style.top = node.position.top + "px";
        element.style.left = node.position.left + "px";
        // Add to ui
        divLayout.appendChild(element);
        // Add to data
        data.nodes.set(node.nodeId, node);
        if (data.incoming.has(node.nodeId) || data.outgoing.has(node.nodeId)) {
            throw new Error(`Unexpected duplicate nodeId`);
        }
        data.incoming.set(node.nodeId, new Map());
        data.outgoing.set(node.nodeId, new Map());
        return element;
    }
}
//# sourceMappingURL=Main.js.map