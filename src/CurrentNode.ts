import { Data, NodeId } from "./Data";
export class CurrentNode {

    arrow?: SVGElement;

    constructor(public data: Data) { }

    setCurrentNode(nodeId: NodeId) {
        this.data.currentNodeId = nodeId;

        // position the arrow indicator
        const element = document.getElementById(`node-${nodeId}`)!;
        this.arrow!.style.display = "block";
        this.arrow!.setAttribute("x", element.style.left);
        this.arrow!.setAttribute("y", parseInt(element.style.top) - 30 + "px");

        // scroll into view
        const checkCenter = document.getElementById("input-center")! as HTMLInputElement;
        if (!checkCenter.checked) {
            return;
        }
        element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }

    unsetCurrentNode() {
        this.arrow!.style.display = "none";
        this.data.currentNodeId = undefined;
    }

    makeCurrentArrow() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.display = "none";
        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arrow.setAttribute("d", "M 0 0 L 170 0 L 85 20 Z");
        arrow.setAttribute("fill", "black");
        svg.appendChild(arrow);
        this.arrow = svg;
        this.data.svgLayout!.appendChild(svg);
    }

}