import { Data } from "./Data";

export class PathMaker {

    constructor(public data: Data) { }

    makePath(start: { x: number, y: number }, end: { x: number, y: number }) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const newPathData = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
        path.setAttribute("d", newPathData);
        path.setAttribute("stroke", "black");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("marker-end", "url(#arrow)");
        return path;
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