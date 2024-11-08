import { Data, NodeId } from "./Data";
export class CurrentNode {

    arrow?: SVGElement;

    constructor(public data: Data) { }

    setCurrentNode(nodeId: NodeId) {
        this.data.currentNodeId = nodeId;

        // position the arrow indicator
        const element = document.getElementById(`node-${nodeId}`)!;
        this.arrow!.style.display = "block";
        this.arrow!.setAttribute("x", parseInt(element.style.left) - 5 + "px");
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
        arrow.setAttribute("d", "M 30 0 L 140 0 L 140 7 L 85 20 L 30 7 Z");
        arrow.setAttribute("fill", getComputedStyle(document.documentElement).getPropertyValue('--node-background'));
        svg.appendChild(arrow);
        this.arrow = svg;
        this.data.svgLayout!.appendChild(svg);
    }

}