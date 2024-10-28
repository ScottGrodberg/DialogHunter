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
        const choiceMaker = new ChoiceMaker(data, rowMaker);
        const nodeMaker = new NodeMaker(rowMaker, utility, data, choiceMaker);

        this.composeLayout(data, utility, nodeMaker);
        this.composeStepthru(data, utility);

        connector.init();

    }

    composeLayout(data: Data, utility: Utility, nodeMaker: NodeMaker) {

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
        const firstInterchange = this.newNode(nodeMaker, utility, data);
        firstInterchange.style.top = "66px";
        firstInterchange.style.left = "100px";

        // Element composition
        divLayout.appendChild(svgLayout);
        divLayoutWrapper.appendChild(divLayout);
        document.body.appendChild(divLayoutWrapper);
    }

    composeStepthru(data: Data, utility: Utility) {
        // Stepthru wrapper
        const divStepthruWrapper = document.createElement("div");
        divStepthruWrapper.id = "div-stepthru-wrapper";
        divStepthruWrapper.style.height = "50%";
        divStepthruWrapper.style.overflow = "scroll";
        data.divStepthruWrapper = divStepthruWrapper;

        // Stepthru inner
        const divStepthru = document.createElement("div");
        divStepthru.id = "div-stepthru";
        divStepthru.style.width = "2000px";
        divStepthru.style.height = "1000px";
        divStepthru.style.position = "relative";
        data.divStepthru = divStepthru;

        // Add play button
        const buttonPlay = document.createElement("button");
        buttonPlay.id = "button-play";
        buttonPlay.innerHTML = ">";
        buttonPlay.style.position = "fixed";
        buttonPlay.style.zIndex = "1";
        buttonPlay.style.top = "calc(50% + 20px)";
        buttonPlay.style.left = "20px";
        buttonPlay.onclick = () => { throw new Error(`onclick undef`); };
        divStepthruWrapper.appendChild(buttonPlay);

        // Element composition
        divStepthruWrapper.appendChild(divStepthru);
        document.body.appendChild(divStepthruWrapper);
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