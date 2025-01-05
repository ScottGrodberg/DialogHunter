export class CurrentNode {
    constructor(data) {
        this.data = data;
    }
    setCurrentNode(nodeId) {
        this.data.currentNodeId = nodeId;
        // position the arrow indicator
        const element = document.getElementById(`node-${nodeId}`);
        this.arrow.style.display = "block";
        this.arrow.setAttribute("x", parseInt(element.getAttribute("x")) - 5 + "px");
        this.arrow.setAttribute("y", parseInt(element.getAttribute("y")) - 30 + "px");
        // scroll into view
        const checkCenter = document.getElementById("input-center");
        if (!checkCenter.checked) {
            return;
        }
        element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
    unsetCurrentNode() {
        this.arrow.style.display = "none";
        this.data.currentNodeId = undefined;
    }
    makeCurrentArrow() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.display = "none";
        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arrow.setAttribute("d", "M 30 0 L 140 0 L 140 7 L 85 20 L 30 7 Z");
        arrow.setAttribute("fill", "#00b2a3");
        svg.appendChild(arrow);
        this.arrow = svg;
        this.data.svgLayout.appendChild(svg);
    }
}
//# sourceMappingURL=CurrentNode.js.map