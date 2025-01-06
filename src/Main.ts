import { ChoiceMaker } from "./ChoiceMaker.js";
import { Connector } from "./Connector.js";
import { CurrentNode } from "./CurrentNode.js";
import { Data, NodeId, SocketsConnection } from "./Data.js";
import { Node, NodeType } from "./Node.js";
import { NodeEditor } from "./NodeEditor.js";
import { NodeLayout } from "./NodeLayout.js";
import { RowMaker } from "./RowMaker.js";
import { Utility } from "./Utility.js";

const svgns = "http://www.w3.org/2000/svg";

// Entry point
window.addEventListener("DOMContentLoaded", () => {
    const main = new Main();
});


export class Main {

    constructor() {
        // Begin composition root
        const data = new Data();
        const utility = new Utility();
        const connector = new Connector(data);
        const currentNode = new CurrentNode(data);
        const rowMaker = new RowMaker(connector, utility);
        const choiceMaker = new ChoiceMaker(data, rowMaker, currentNode, connector);
        const nodeLayout = new NodeLayout(rowMaker, utility, data, choiceMaker, currentNode, connector);
        const nodeEditor = new NodeEditor(rowMaker, utility, data, choiceMaker, currentNode, connector, nodeLayout);

        this.composeLayout(data, utility, nodeLayout, currentNode);
        this.composeEditor(data, nodeEditor);

        connector.init();

    }

    composeLayout(data: Data, utility: Utility, nodeMaker: NodeLayout, currentNode: CurrentNode) {

        // Layout wrapper
        const divLayoutWrapper = document.createElement("div");
        divLayoutWrapper.id = "div-layout-wrapper";
        divLayoutWrapper.style.height = "48.5%";
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

        // Make the buttons
        const buttonsWrapper = document.createElement("div");
        buttonsWrapper.style.display = "flex";
        buttonsWrapper.style.position = "fixed";
        buttonsWrapper.style.zIndex = "1";
        buttonsWrapper.style.top = "20px";
        buttonsWrapper.style.left = "20px";

        const buttonNewInterchange = this.newButton(data, utility, nodeMaker, NodeType.INTR);
        buttonNewInterchange.innerHTML = `+ Add Interchange (${NodeType[NodeType.INTR]})`;
        const buttonNewRoll = this.newButton(data, utility, nodeMaker, NodeType.ROLL);
        buttonNewRoll.innerHTML = `+ Add Roll (${NodeType[NodeType.ROLL]})`;
        buttonsWrapper.append(buttonNewInterchange, buttonNewRoll);

        divLayoutWrapper.append(buttonsWrapper);

        // Options
        const divOptsWrapper = document.createElement("div");
        divOptsWrapper.style.position = "fixed";
        divOptsWrapper.style.display = "flex";
        divOptsWrapper.style.right = "40px";
        divOptsWrapper.style.top = "20px";
        divOptsWrapper.style.zIndex = "1";

        const labelCenter = document.createElement("label");
        labelCenter.setAttribute("for", "input-center");
        labelCenter.innerHTML = "Center on current node";
        labelCenter.title = "Make sure chrome://flags/#smooth-scrolling is set";
        divOptsWrapper.appendChild(labelCenter);

        const checkCenterOnCurrent = document.createElement("input");
        checkCenterOnCurrent.id = "input-center";
        checkCenterOnCurrent.type = "checkbox";
        divOptsWrapper.append(checkCenterOnCurrent);
        divLayoutWrapper.append(divOptsWrapper)

        divLayout.onwheel = (event: WheelEvent) => {
            if (!event.ctrlKey) {
                return;
            }
            if (event.deltaY > 0) {
                data.zoomScaleFactor -= 0.1;
            } else {
                data.zoomScaleFactor += 0.1;
            }
            divLayout.style.transform = `scale(${data.zoomScaleFactor})`;
            console.log(`divLayout zoom scale factor is ${data.zoomScaleFactor}`);
            event.stopPropagation();
            event.preventDefault();
        };

        // "Current node" indicator
        currentNode.makeCurrentArrow();

        // Element composition
        divLayout.appendChild(svgLayout);
        divLayoutWrapper.appendChild(divLayout);
        document.body.appendChild(divLayoutWrapper);

        // Start with one interchange
        const nodeFirst = this.newNode(nodeMaker, utility, data, NodeType.INTR);
        data.head = nodeFirst.dataset.nodeId;

        // Special starting position for first node only
        const node = data.nodes.get(data.head!)!;
        node.position = { top: 66, left: 100 };
        nodeFirst.style.top = node.position.top + "px";
        nodeFirst.style.left = node.position.top + "px";
    }

    newButton(data: Data, utility: Utility, nodeMaker: NodeLayout, nodeType: NodeType): HTMLButtonElement {
        const button = document.createElement("button");
        button.id = `button-new-node-${NodeType[nodeType]}`;
        button.onclick = () => this.newNode(nodeMaker, utility, data, nodeType);
        return button;
    }

    composeEditor(data: Data, nodeEditor: NodeEditor) {
        // Editor wrapper
        const divEditorWrapper = document.createElement("div");
        divEditorWrapper.id = "div-editor-wrapper";
        divEditorWrapper.style.height = "48.5%";
        data.divEditorWrapper = divEditorWrapper;

        const divSidebar = nodeEditor.makeSidebar();
        const divOutput = nodeEditor.makeOutput();
        const nodeEditorElement = nodeEditor.makeEditor();

        // Element composition
        divEditorWrapper.append(divSidebar, nodeEditorElement, divOutput);
        document.body.appendChild(divEditorWrapper);
    }


    newNode(nodeLayout: NodeLayout, utility: Utility, data: Data, nodeType: NodeType): HTMLElement {
        const divLayout = data.divLayout!;
        const divLayoutWrapper = data.divLayoutWrapper!;

        const node = new Node(utility.generateUid(8), nodeType, "Change this text, it can be a description or monologue or question");
        const element = nodeLayout.node(node);

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
        data.incoming.set(node.nodeId, new Map<NodeId, SocketsConnection>());
        data.outgoing.set(node.nodeId, new Map<NodeId, SocketsConnection>());

        return element;
    }

}