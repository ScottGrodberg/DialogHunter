import { Data } from "./Data";

export class Connector {

    line?: SVGElement;
    socketFrom?: HTMLElement;

    constructor(public data: Data) { }

    init() {
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.appendChild(this.createArrowMarker());
        this.data.svgLayout!.appendChild(defs);

        this.data.divLayout!.addEventListener('pointerup', this.onPointerUp.bind(this));
        this.data.divLayout!.addEventListener('pointermove', this.onPointerMove.bind(this));

    }

    onPointerDown(event: PointerEvent) {
        event.stopPropagation();

        this.socketFrom = event.target as HTMLElement;

        this.removeExistingConnection();

        // Hide the choice sockets and show the node sockets
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
        this.line.setAttribute("x1", start.x.toString());   // from
        this.line.setAttribute("y1", start.y.toString());
        this.line.setAttribute("x2", start.x.toString());   // to
        this.line.setAttribute("y2", start.y.toString());
        this.line.setAttribute("stroke", "black");
        this.line.setAttribute("stroke-width", "2");
        this.line.setAttribute("marker-end", "url(#arrow)");
        this.data.svgLayout!.appendChild(this.line);
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

            const choiceId = this.socketFrom.dataset.choiceId!;

            // data
            this.data.choices.get(choiceId)!.nodeId = validConnection.nodeIdTo;
            this.data.outgoing.get(validConnection.nodeIdFrom)!.set(validConnection.nodeIdTo, { socketFrom: this.socketFrom, line: this.line, socketTo });
            this.data.incoming.get(validConnection.nodeIdTo)!.set(validConnection.nodeIdFrom, { socketFrom: this.socketFrom, line: this.line, socketTo });

            // ui
            const end = this.getSocketCenter(socketTo);
            this.line.setAttribute("x2", end.x.toString());
            this.line.setAttribute("y2", end.y.toString());
            this.socketFrom.removeEventListener('pointerdown', this.onPointerDown);

            // Look at the editor, find the moveNextArrow for the choice that correspods to the socketFrom, and enable it
            const choice = document.querySelector(`#node-editor-body #choice-${choiceId} button:nth-child(3)`) as HTMLElement;
            if (choice) {
                choice.style.visibility = "visible";
            }
        }
        this.line = undefined;
        this.socketFrom = undefined;

        // Hide the node sockets and show the choice sockets
        const allSockets = document.getElementsByClassName("socket");
        const connectedSockets = this.allConnectedSockets();
        [...allSockets].forEach(socket => {
            const _socket = socket as HTMLElement;
            if ("choiceId" in _socket.dataset || connectedSockets.has(_socket)) {
                _socket.style.display = "block";
            } else {
                _socket.style.display = "none";
            }
        });
    }

    removeExistingConnection() {
        const choiceIdFrom = this.socketFrom?.dataset.choiceId!;
        const nodeIdFrom = this.socketFrom?.dataset.nodeId!;

        // unset the choice's nodeId
        const choice = this.data.choices.get(choiceIdFrom);
        if (!choice?.nodeId) {
            // choice is not connected to another node
            console.log(`choice ${choiceIdFrom} is not connected to another node`);
            return;
        }
        const nodeIdTo = choice.nodeId;
        choice.nodeId = undefined;

        // Delete the incoming and outgoing connections
        const nodeFrom = this.data.outgoing.get(nodeIdFrom);
        const nodeTo = nodeFrom!.get(nodeIdTo);
        const line = nodeTo!.line;
        nodeFrom!.delete(nodeIdTo);
        this.data.incoming.get(nodeIdTo)?.delete(nodeIdFrom);

        // Remove the line from the dom
        line.remove();
    }

    /** Determine a set of connected sockets, whether they are an incoming or outgoing socket */
    allConnectedSockets(): Set<HTMLElement> {
        const socketsConnected = new Set<HTMLElement>();
        this.data.incoming.forEach(_sc1 => _sc1.forEach(_sc => {
            socketsConnected.add(_sc.socketFrom);
            socketsConnected.add(_sc.socketTo);
        }));
        this.data.outgoing.forEach(_sc1 => _sc1.forEach(_sc => {
            socketsConnected.add(_sc.socketFrom);
            socketsConnected.add(_sc.socketTo);
        }));
        return socketsConnected;
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

        const nodeIdFrom = this.socketFrom!.dataset.nodeId!;
        const nodeIdTo = socketTo.dataset.nodeId!;
        if (nodeIdFrom === nodeIdTo) {
            // don't allow connections between sockets of the same node
            return false;
        }

        if (this.data.incoming.get(nodeIdTo)?.has(nodeIdFrom)) {
            // this node already has a connection from the "from" node
            return false;
        }

        const choiceId = this.socketFrom!.dataset.choiceId!;
        if (this.data.choices.get(choiceId)!.nodeId) {
            // outgoing socket already has a connection to another node
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
        const svgRect = this.data.svgLayout!.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2 - svgRect.left,
            y: rect.top + rect.height / 2 - svgRect.top,
        };
    }
}