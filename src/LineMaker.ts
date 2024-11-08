import { Data } from "./Data";

export class LineMaker {

    constructor(public data: Data) { }

    makeLine(start: { x: number, y: number }, end: { x: number, y: number }) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const newPathData = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
        line.setAttribute("d", newPathData);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("marker-end", "url(#arrow)");
        return line;
    }

    getSocketCenter(socket: HTMLElement) {
        const rect = socket.getBoundingClientRect();
        const svgRect = this.data.svgLayout!.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2 - svgRect.left,
            y: rect.top + rect.height / 2 - svgRect.top,
        };
    }
}