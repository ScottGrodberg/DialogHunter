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

        // Layout wrapper
        const divWrapper = document.createElement("div");
        divWrapper.id = "divWrapper";
        divWrapper.style.height = "50%";
        divWrapper.style.overflow = "scroll";
        document.body.appendChild(divWrapper);

        // Layout inner
        const div = document.createElement("div");
        div.style.width = "2000px";
        div.style.height = "1000px";
        div.style.position = "relative";

        // Svg
        const svg = document.createElementNS(svgns, "svg");
        svg.id = "svg-layout";
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        div.appendChild(svg);

        const connector = new Connector(data, div, svg);
        const rowMaker = new RowMaker(connector, utility);
        const choiceMaker = new ChoiceMaker(data, rowMaker);
        const nodeMaker = new NodeMaker(rowMaker, utility, data, choiceMaker);

        // Add new interchange button
        const buttonNew = document.createElement("button");
        buttonNew.innerHTML = "+";
        buttonNew.style.position = "fixed";
        buttonNew.style.zIndex = "1";
        buttonNew.style.top = "0";
        buttonNew.style.left = "0";
        buttonNew.onclick = () => this.newNode(nodeMaker, utility, data, divWrapper, div);
        div.appendChild(buttonNew);

        // Start with one interchange
        const firstInterchange = this.newNode(nodeMaker, utility, data, divWrapper, div);
        firstInterchange.style.top = "66px";
        firstInterchange.style.left = "100px";

        // Final composition
        divWrapper.appendChild(div);
        document.body.appendChild(divWrapper);

    }

    newNode(nodeMaker: NodeMaker, utility: Utility, data: Data, divWrapper: HTMLDivElement, div: HTMLDivElement): HTMLElement {
        const node = new Node(utility.generateUid(8));
        data.nodes.set(node.nodeId, node);
        const element = nodeMaker.node(node.nodeId);

        // Add to ui
        const left = divWrapper.scrollLeft + divWrapper.offsetWidth * 0.5 + Math.random() * 100 - 50 - NodeMaker.DEFAULT_WIDTH * 0.5;
        const top = divWrapper.scrollTop + divWrapper.offsetHeight * 0.5 + Math.random() * 100 - 50 - NodeMaker.DEFAULT_WIDTH * 0.5;
        element.style.left = left + "px";
        element.style.top = top + "px";
        div.appendChild(element);

        // Add to data
        if (data.incoming.has(node.nodeId) || data.outgoing.has(node.nodeId)) {
            throw new Error(`Unexpected duplicate nodeId`);
        }
        data.incoming.set(node.nodeId, new Map<NodeId, Line>());
        data.outgoing.set(node.nodeId, new Map<NodeId, Line>());

        return element;
    }
}