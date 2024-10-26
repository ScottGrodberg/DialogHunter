export class Connector {

    line?: SVGElement;
    socketFrom?: HTMLElement;

    constructor(public container: HTMLElement, public svg: SVGElement) {

        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.appendChild(this.createArrowMarker());
        this.svg.appendChild(defs);

        container.addEventListener('pointerup', this.onPointerUp);
        container.addEventListener('pointermove', this.onPointerMove);

    }

    onPointerDown(event: PointerEvent) {
        this.socketFrom = event.target as HTMLElement;
        const start = this.getSocketCenter(this.socketFrom);

        this.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        this.line.setAttribute("x1", start.x);
        this.line.setAttribute("y1", start.y);
        this.line.setAttribute("x2", start.x);
        this.line.setAttribute("y2", start.y);
        this.line.setAttribute("stroke", "black");
        this.line.setAttribute("stroke-width", "2");
        this.line.setAttribute("marker-end", "url(#arrow)");
        this.svg.appendChild(this.line);
    }

    onPointerMove(event: PointerEvent) {
        if (!this.line) return;
        const svgPoint = this.svg.createSVGPoint();
        svgPoint.x = event.clientX;
        svgPoint.y = event.clientY;
        const transformedPoint = svgPoint.matrixTransform(this.svg.getScreenCTM().inverse());

        this.line.setAttribute("x2", transformedPoint.x);
        this.line.setAttribute("y2", transformedPoint.y);
    }

    /**
     * TODO: Check to make sure the connection isnt between two nodes/interchanges that already have a connection in either direction
     * TODO: Bezier curve for this.lines: https://www.w3.org/TR/SVG2/paths.html#PathDataQuadraticBezierCommands
     */
    onPointerUp(event: PointerEvent) {
        if (!this.line || !this.socketFrom) return;

        if (!event.srcElement?.getAttribute("id").startsWith("socket")) {
            this.line.remove();
        } else {
            const end = this.getSocketCenter(event.target as HTMLElement);
            this.line.setAttribute("x2", end.x);
            this.line.setAttribute("y2", end.y);
            this.socketFrom.removeEventListener('pointerdown', this.onPointerDown);
        }
        this.line = undefined;
    }

    createArrowMarker() {
        const arrowMarker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        arrowMarker.setAttribute("id", "arrow");
        arrowMarker.setAttribute("markerWidth", "10");
        arrowMarker.setAttribute("markerHeight", "10");
        arrowMarker.setAttribute("refX", "5");
        arrowMarker.setAttribute("refY", "5");
        arrowMarker.setAttribute("orient", "auto-start-reverse");
        arrowMarker.setAttribute("markerUnits", "strokeWidth");

        const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arrowPath.setAttribute("d", "M0,0 L10,5 L0,10 Z");
        arrowPath.setAttribute("fill", "black");
        arrowMarker.appendChild(arrowPath);

        return arrowMarker;
    }

    getSocketCenter(socket: HTMLElement) {
        const rect = socket.getBoundingClientRect();
        const svgRect = this.svg.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2 - svgRect.left,
            y: rect.top + rect.height / 2 - svgRect.top,
        };
    }
}