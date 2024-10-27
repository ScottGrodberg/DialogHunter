import { Data } from "./Data";

export class Connector {

    line?: SVGElement;
    socketFrom?: HTMLElement;

    constructor(public data: Data, public container: HTMLElement, public svg: SVGSVGElement) {

        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.appendChild(this.createArrowMarker());
        this.svg.appendChild(defs);

        container.addEventListener('pointerup', this.onPointerUp.bind(this));
        container.addEventListener('pointermove', this.onPointerMove.bind(this));

    }

    onPointerDown(event: PointerEvent) {
        event.preventDefault();

        this.socketFrom = event.target as HTMLElement;

        const sockets = document.getElementsByClassName("socket");
        [...sockets].forEach(socket => {
            const _socket = socket as HTMLElement;
            if ("choiceId" in _socket.dataset && _socket !== this.socketFrom) {
                _socket.style.display = "none";
            } else {
                _socket.style.display = "block";
            }
        });

        const start = this.getSocketCenter(this.socketFrom);

        this.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        this.line.setAttribute("x1", start.x.toString());
        this.line.setAttribute("y1", start.y.toString());
        this.line.setAttribute("x2", start.x.toString());
        this.line.setAttribute("y2", start.y.toString());
        this.line.setAttribute("stroke", "black");
        this.line.setAttribute("stroke-width", "2");
        this.line.setAttribute("marker-end", "url(#arrow)");
        this.svg.appendChild(this.line);
    }

    onPointerMove(event: PointerEvent) {
        if (!this.line || !this.socketFrom) {
            return;
        }

        this.line.setAttribute("x2", event.clientX.toString());
        this.line.setAttribute("y2", event.clientY.toString());
    }

    /**
     * TODO: Bezier curve for this.lines: https://www.w3.org/TR/SVG2/paths.html#PathDataQuadraticBezierCommands
     */
    onPointerUp(event: PointerEvent) {
        if (!this.line || !this.socketFrom) {
            return;
        }

        const socketTo = event.target as HTMLElement;
        const validConnection = this.validateConnection(socketTo);
        if (validConnection === false) {
            this.line.remove();
        } else {
            // ui
            const end = this.getSocketCenter(socketTo);
            this.line.setAttribute("x2", end.x.toString());
            this.line.setAttribute("y2", end.y.toString());
            this.socketFrom.removeEventListener('pointerdown', this.onPointerDown);

            // data
            this.data.outgoing.get(validConnection.nodeIdFrom)?.add(validConnection.nodeIdTo);
            this.data.incoming.get(validConnection.nodeIdTo)?.add(validConnection.nodeIdFrom);
        }
        this.line = undefined;
        this.socketFrom = undefined;

        const sockets = document.getElementsByClassName("socket");
        [...sockets].forEach(socket => {
            const _socket = socket as HTMLElement;
            if ("choiceId" in _socket.dataset || _socket === socketTo) {
                _socket.style.display = "block";
            } else {
                _socket.style.display = "none";
            }
        });
    }

    validateConnection(socketTo: HTMLElement): false | { nodeIdFrom: string, nodeIdTo: string } {
        if (!socketTo.getAttribute("id")?.startsWith("socket")) {
            // did not end on a socket
            return false;
        }

        if (socketTo === this.socketFrom) {
            // don't allow connection to self (same socket)
            return false;
        }

        const nodeIdFrom = this.socketFrom?.dataset.nodeId!;
        const nodeIdTo = socketTo.dataset.nodeId!;
        if (nodeIdFrom === nodeIdTo) {
            // don't allow connections between sockets of the same node
            return false;
        }

        if (this.data.incoming.get(nodeIdTo)?.has(nodeIdFrom)) {
            // this node already has a connection from the "from" node
            return false;
        }

        if (this.data.outgoing.get(nodeIdTo)?.has(nodeIdFrom)) {
            // there is already a connection going the other way
            return false;
        }

        return { nodeIdFrom, nodeIdTo };
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