export class LineMaker {
    constructor(data) {
        this.data = data;
    }
    makeLine(start) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", start.x.toString()); // from
        line.setAttribute("y1", start.y.toString());
        line.setAttribute("x2", start.x.toString()); // to
        line.setAttribute("y2", start.y.toString());
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("marker-end", "url(#arrow)");
        return line;
    }
    getSocketCenter(socket) {
        const rect = socket.getBoundingClientRect();
        const svgRect = this.data.svgLayout.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2 - svgRect.left,
            y: rect.top + rect.height / 2 - svgRect.top,
        };
    }
}
//# sourceMappingURL=LineMaker.js.map