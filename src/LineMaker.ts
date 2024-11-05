export class LineMaker {
    makeLine(start: { x: number, y: number }) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", start.x.toString());   // from
        line.setAttribute("y1", start.y.toString());
        line.setAttribute("x2", start.x.toString());   // to
        line.setAttribute("y2", start.y.toString());
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("marker-end", "url(#arrow)");
        return line;
    }
}