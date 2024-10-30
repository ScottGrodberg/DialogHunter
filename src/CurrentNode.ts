import { Data, NodeId } from "./Data";
export class CurrentNode {

    constructor(public data: Data) { }

    setCurrentNode(nodeId: NodeId) { }

    makeArrow() {
        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arrow.setAttribute("d", "M 70 10 L 130 30 L 10 30 Z");
        arrow.setAttribute("fill", "black");
        this.data.svgLayout!.appendChild(arrow);
    }
}