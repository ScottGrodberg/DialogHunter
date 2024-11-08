export class PathMaker {
    constructor(data) {
        this.data = data;
    }
    makePath(start, end) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const newPathData = `M ${start.x} ${start.y} C ${start.x} ${start.y}, ${end.x} ${end.y}, ${end.x} ${end.y}`;
        path.setAttribute("d", newPathData);
        path.setAttribute("stroke", "black");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("fill", "none");
        path.setAttribute("marker-end", "url(#arrow)");
        return path;
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
//# sourceMappingURL=PathMaker.js.map