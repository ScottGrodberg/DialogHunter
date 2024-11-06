export class CurrentNode {
    constructor(data) {
        this.data = data;
    }
    setCurrentNode(nodeId) {
        this.data.currentNodeId = nodeId;
        const element = document.getElementById(`node-${nodeId}`);
        this.arrow.style.display = "block";
        this.arrow.setAttribute("x", element.style.left);
        this.arrow.setAttribute("y", parseInt(element.style.top) - 30 + "px");
    }
    unsetCurrentNode() {
        this.arrow.style.display = "none";
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
        this.data.svgLayout.appendChild(svg);
    }
}
//# sourceMappingURL=CurrentNode.js.map