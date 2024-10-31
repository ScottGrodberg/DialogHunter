import { Data, NodeId } from "./Data";
export class CurrentNode {

    arrow?: SVGElement;

    constructor(public data: Data) { }

    setCurrentNode(nodeId: NodeId) {
        this.data.currentNodeId = nodeId;

        const element = document.getElementById(`node-${nodeId}`)!;
        this.arrow!.setAttribute("x", element.style.left);
    }


    makeCurrentArrow() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("x", "-200px"); // start offscreen to the left 
        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arrow.setAttribute("d", "M 70 10 L 130 30 L 10 30 Z");
        arrow.setAttribute("fill", "black");
        svg.appendChild(arrow);
        this.arrow = svg;
        this.data.svgLayout!.appendChild(svg);
    }
}