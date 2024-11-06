export class CurrentNode {
    constructor(data) {
        this.data = data;
    }
    setCurrentNode(nodeId) {
        this.data.currentNodeId = nodeId;
        const element = document.getElementById(`node-${nodeId}`);
        this.arrow.setAttribute("x", element.style.left);
        this.arrow.setAttribute("y", parseInt(element.style.top) - 30 + "px");
    }
    makeCurrentArrow() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("x", "-200px"); // start offscreen to the left 
        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arrow.setAttribute("d", "M 0 0 L 170 0 L 85 20 Z");
        arrow.setAttribute("fill", "black");
        svg.appendChild(arrow);
        this.arrow = svg;
        this.data.svgLayout.appendChild(svg);
    }
}
//# sourceMappingURL=CurrentNode.js.map