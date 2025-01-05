import { ChoiceMaker } from "./ChoiceMaker.js";
import { Connector } from "./Connector.js";
import { CurrentNode } from "./CurrentNode.js";
import { Data, NodeId, SocketsConnection } from "./Data.js";
import { Node } from "./Node.js";
import { NodeEditor } from "./NodeEditor.js";
import { NodeLayout } from "./NodeLayout.js";
import { RowMaker } from "./RowMaker.js";
import { Utility } from "./Utility.js";


// Entry point
window.addEventListener("DOMContentLoaded", () => {
    const main = new Main();
});


export class Main {

    zoomScaleFactor = 1.0;

    constructor() {
        // Begin composition root
        const data = new Data();
        const utility = new Utility();
        const connector = new Connector(data);
        const currentNode = new CurrentNode(data);
        const rowMaker = new RowMaker(data, connector, utility);
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

        // Svg
        const svgLayout = document.createElementNS(data.SVGNS, "svg") as SVGElement;
        svgLayout.id = "svg-layout";
        svgLayout.setAttribute("width", "100%");
        svgLayout.setAttribute("height", "100%");
        data.svgLayout = svgLayout;

        // Add new node button
        const buttonNew = document.createElement("button");
        buttonNew.id = "button-new-node";
        buttonNew.innerHTML = "+ Add Node";
        buttonNew.style.position = "fixed";
        buttonNew.style.zIndex = "1";
        buttonNew.style.top = "20px";
        buttonNew.style.left = "20px";
        buttonNew.onclick = () => this.newNode(nodeMaker, utility, data);
        divLayoutWrapper.appendChild(buttonNew);

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

        svgLayout.onwheel = (event: WheelEvent) => {
            if (!event.ctrlKey) {
                return;
            }
            const ratio = divLayoutWrapper.clientWidth / divLayoutWrapper.clientHeight;
            if (event.deltaY > 0) {
                data.svgViewBox.height -= 10;
                data.svgViewBox.width -= 10 * ratio;
            } else {
                data.svgViewBox.height += 10;
                data.svgViewBox.width += 10 * ratio;
            }
            svgLayout.setAttribute("viewBox", `${data.svgViewBox.left} ${data.svgViewBox.top} ${data.svgViewBox.width} ${data.svgViewBox.height}`)
            event.stopPropagation();
            event.preventDefault();
        };

        // "Current node" indicator
        currentNode.makeCurrentArrow();

        // Element composition
        divLayoutWrapper.appendChild(svgLayout);
        document.body.appendChild(divLayoutWrapper);

        // Start with one interchange
        const nodeFirst = this.newNode(nodeMaker, utility, data);
        data.head = nodeFirst.dataset.nodeId;

        // Special starting position for first node only
        const node = data.nodes.get(data.head!)!;
        node.position = { x: 100, y: 66 };
        nodeFirst.setAttribute("x", node.position.x.toString());
        nodeFirst.setAttribute("y", node.position.y.toString());
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


    newNode(nodeLayout: NodeLayout, utility: Utility, data: Data): SVGElement {
        const svgLayout = data.svgLayout!;
        const divLayoutWrapper = data.divLayoutWrapper!;

        const node = new Node(utility.generateUid(8), "Change this text, it can be a description or monologue or question");
        const element = nodeLayout.node(node.nodeId);

        // Set the node's position
        const x = divLayoutWrapper.scrollLeft + divLayoutWrapper.offsetWidth * 0.5 + Math.random() * 100 - 50 - data.NODE_WIDTH * 0.5;
        const y = divLayoutWrapper.scrollTop + divLayoutWrapper.offsetHeight * 0.5 + Math.random() * 100 - 50 - data.NODE_WIDTH * 0.5;
        node.position = { x, y };
        element.setAttribute("x", node.position.x.toString());
        element.setAttribute("y", node.position.y.toString());

        // Add to ui
        svgLayout.appendChild(element);

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