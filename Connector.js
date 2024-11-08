export class Connector {
    constructor(data) {
        this.data = data;
    }
    init() {
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.appendChild(this.createArrowMarker());
        this.data.svgLayout.appendChild(defs);
        this.data.divLayout.addEventListener('pointerup', this.onPointerUp.bind(this));
        this.data.divLayout.addEventListener('pointermove', this.onPointerMove.bind(this));
    }
    makePath(start, end) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.setPathPoints(path, start.x, start.y, end.x, end.y);
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
    onPointerDown(event) {
        event.stopPropagation();
        this.data.divLayout.style.userSelect = "none";
        this.socketFrom = event.target;
        this.removeExistingConnection();
        // Hide the choice sockets and show the node sockets
        const sockets = document.getElementsByClassName("socket");
        [...sockets].forEach(socket => {
            const _socket = socket;
            if ("choiceId" in _socket.dataset && _socket !== this.socketFrom) {
                _socket.style.display = "none";
            }
            else {
                _socket.style.display = "block";
            }
        });
        const start = this.getSocketCenter(this.socketFrom);
        this.path = this.makePath(start, start);
        this.data.svgLayout.appendChild(this.path);
    }
    onPointerMove(event) {
        if (!this.path || !this.socketFrom) {
            return;
        }
        this.setPathEndPoint(this.path, event.clientX, event.clientY);
    }
    onPointerUp(event) {
        if (!this.path || !this.socketFrom) {
            return;
        }
        const socketTo = event.target;
        const validConnection = this.validateConnection(socketTo);
        if (validConnection === false) {
            this.path.remove();
        }
        else {
            const choiceId = this.socketFrom.dataset.choiceId;
            // data
            this.data.choices.get(choiceId).nodeId = validConnection.nodeIdTo;
            this.data.outgoing.get(validConnection.nodeIdFrom).set(validConnection.nodeIdTo, { socketFrom: this.socketFrom, path: this.path, socketTo });
            this.data.incoming.get(validConnection.nodeIdTo).set(validConnection.nodeIdFrom, { socketFrom: this.socketFrom, path: this.path, socketTo });
            // ui
            const end = this.getSocketCenter(socketTo);
            this.setPathEndPoint(this.path, end.x, end.y);
            this.socketFrom.removeEventListener('pointerdown', this.onPointerDown);
            // Look at the editor, find the moveNextArrow for the choice that correspods to the socketFrom, and enable it
            const choice = document.querySelector(`#node-editor-body #choice-${choiceId} button:nth-child(3)`);
            if (choice) {
                choice.style.visibility = "visible";
            }
        }
        this.path = undefined;
        this.socketFrom = undefined;
        // Hide the node sockets and show the choice sockets
        const allSockets = document.getElementsByClassName("socket");
        const connectedSockets = this.allConnectedSockets();
        [...allSockets].forEach(socket => {
            const _socket = socket;
            if ("choiceId" in _socket.dataset || connectedSockets.has(_socket)) {
                _socket.style.display = "block";
            }
            else {
                _socket.style.display = "none";
            }
        });
        this.data.divLayout.style.userSelect = "initial";
    }
    /**
     * @param x ending x
     * @param y ending y
     */
    setPathEndPoint(path, x, y) {
        const oldPathData = path.getAttribute("d").split(/(?:,| )+/);
        const startX = parseFloat(oldPathData[1]);
        const startY = parseFloat(oldPathData[2]);
        const endX = x;
        const endY = y;
        this.setPathPoints(path, startX, startY, endX, endY);
    }
    setPathStartPoint(path, x, y) {
        const oldPathData = path.getAttribute("d").split(/(?:,| )+/);
        const startX = x;
        const startY = y;
        const endX = parseFloat(oldPathData[8]);
        const endY = parseFloat(oldPathData[9]);
        this.setPathPoints(path, startX, startY, endX, endY);
    }
    setPathPoints(path, startX, startY, endX, endY) {
        let X1, Y1, X2, Y2;
        if (endX > startX) {
            // line goes to the right
            X1 = startX + (endX - startX) * 0.5;
            Y1 = startY;
            X2 = X1;
            Y2 = endY;
        }
        else {
            // line goes to the left
            X1 = endX + (startX - endX) * 0.5;
            Y1 = startY;
            X2 = X1;
            Y2 = endY;
        }
        const newPathData = `M ${startX} ${startY} C ${X1} ${Y1}, ${X2} ${Y2}, ${endX} ${endY}`;
        path.setAttribute("d", newPathData);
    }
    removeExistingConnection() {
        var _a, _b, _c;
        const choiceIdFrom = (_a = this.socketFrom) === null || _a === void 0 ? void 0 : _a.dataset.choiceId;
        const nodeIdFrom = (_b = this.socketFrom) === null || _b === void 0 ? void 0 : _b.dataset.nodeId;
        // unset the choice's nodeId
        const choice = this.data.choices.get(choiceIdFrom);
        if (!(choice === null || choice === void 0 ? void 0 : choice.nodeId)) {
            // choice is not connected to another node
            //console.log(`choice ${choiceIdFrom} is not connected to another node`);
            return;
        }
        const nodeIdTo = choice.nodeId;
        choice.nodeId = undefined;
        // Delete the incoming and outgoing connections
        const nodeFrom = this.data.outgoing.get(nodeIdFrom);
        const nodeTo = nodeFrom.get(nodeIdTo);
        const path = nodeTo.path;
        nodeFrom.delete(nodeIdTo);
        (_c = this.data.incoming.get(nodeIdTo)) === null || _c === void 0 ? void 0 : _c.delete(nodeIdFrom);
        // Remove the path from the dom
        path.remove();
    }
    /** Determine a set of connected sockets, whether they are an incoming or outgoing socket */
    allConnectedSockets() {
        const socketsConnected = new Set();
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
    validateConnection(socketTo) {
        var _a, _b;
        if (!((_a = socketTo.getAttribute("id")) === null || _a === void 0 ? void 0 : _a.startsWith("socket"))) {
            // did not end on a socket
            return false;
        }
        if (socketTo === this.socketFrom) {
            // don't allow connection to self (same socket)
            return false;
        }
        const nodeIdFrom = this.socketFrom.dataset.nodeId;
        const nodeIdTo = socketTo.dataset.nodeId;
        if (nodeIdFrom === nodeIdTo) {
            // don't allow connections between sockets of the same node
            return false;
        }
        if ((_b = this.data.incoming.get(nodeIdTo)) === null || _b === void 0 ? void 0 : _b.has(nodeIdFrom)) {
            // this node already has a connection from the "from" node
            return false;
        }
        const choiceId = this.socketFrom.dataset.choiceId;
        if (this.data.choices.get(choiceId).nodeId) {
            // outgoing socket already has a connection to another node
            return false;
        }
        return { nodeIdFrom, nodeIdTo };
    }
    createArrowMarker() {
        const arrowMarker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        arrowMarker.setAttribute("id", "arrow");
        arrowMarker.setAttribute("markerWidth", "15");
        arrowMarker.setAttribute("markerHeight", "7");
        arrowMarker.setAttribute("refX", "13");
        arrowMarker.setAttribute("refY", "3");
        arrowMarker.setAttribute("orient", "auto-start-reverse");
        arrowMarker.setAttribute("markerUnits", "strokeWidth");
        const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arrowPath.setAttribute("d", "M0,0 L15,3 L0,6 Z");
        arrowPath.setAttribute("fill", "black");
        arrowMarker.appendChild(arrowPath);
        return arrowMarker;
    }
}
//# sourceMappingURL=Connector.js.map