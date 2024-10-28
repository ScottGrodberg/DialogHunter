import { ChoiceMaker } from "./ChoiceMaker.js";
import { Connector } from "./Connector.js";
import { Data, Line, NodeId } from "./Data.js";
import { Node } from "./Node.js";
import { NodeMaker } from "./NodeMaker.js";
import { RowMaker } from "./RowMaker.js";
import { Utility } from "./Utility.js";

const svgns = "http://www.w3.org/2000/svg";

// Entry point
window.addEventListener("DOMContentLoaded", () => {
    const main = new Main();
    main.setup();
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

    setup() {
        // Begin composition root
        const data = new Data();
        const utility = new Utility();

        const connector = new Connector(data);
        const rowMaker = new RowMaker(connector, utility);
        const choiceMaker = new ChoiceMaker(data, rowMaker);
        const nodeMaker = new NodeMaker(rowMaker, utility, data, choiceMaker);

        // Layout wrapper
        const divLayoutWrapper = document.createElement("div");
        divLayoutWrapper.id = "divWrapper";
        divLayoutWrapper.style.height = "50%";
        divLayoutWrapper.style.overflow = "scroll";
        data.divLayoutWrapper = divLayoutWrapper;

        // Layout inner
        const divLayout = document.createElement("div");
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

        // Add new interchange button
        const buttonNew = document.createElement("button");
        buttonNew.innerHTML = "+";
        buttonNew.style.position = "fixed";
        buttonNew.style.zIndex = "1";
        buttonNew.style.top = "0";
        buttonNew.style.left = "0";
        buttonNew.onclick = () => this.newNode(nodeMaker, utility, data);
        divLayout.appendChild(buttonNew);

        // Start with one interchange
        const firstInterchange = this.newNode(nodeMaker, utility, data);
        firstInterchange.style.top = "66px";
        firstInterchange.style.left = "100px";

        // Element composition
        divLayout.appendChild(svgLayout);
        divLayoutWrapper.appendChild(divLayout);
        document.body.appendChild(divLayoutWrapper);

        connector.init();

    }

    newNode(nodeMaker: NodeMaker, utility: Utility, data: Data): HTMLElement {
        const divLayout = data.divLayout!;
        const divLayoutWrapper = data.divLayoutWrapper!;

        const node = new Node(utility.generateUid(8));
        data.nodes.set(node.nodeId, node);
        const element = nodeMaker.node(node.nodeId);

        // Add to ui
        const left = divLayoutWrapper.scrollLeft + divLayoutWrapper.offsetWidth * 0.5 + Math.random() * 100 - 50 - NodeMaker.DEFAULT_WIDTH * 0.5;
        const top = divLayoutWrapper.scrollTop + divLayoutWrapper.offsetHeight * 0.5 + Math.random() * 100 - 50 - NodeMaker.DEFAULT_WIDTH * 0.5;
        element.style.left = left + "px";
        element.style.top = top + "px";
        divLayout.appendChild(element);

        // Add to data
        if (data.incoming.has(node.nodeId) || data.outgoing.has(node.nodeId)) {
            throw new Error(`Unexpected duplicate nodeId`);
        }
        data.incoming.set(node.nodeId, new Map<NodeId, Line>());
        data.outgoing.set(node.nodeId, new Map<NodeId, Line>());

        return element;
    }
}