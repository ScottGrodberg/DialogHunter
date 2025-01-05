export class NodeLayout {
    constructor(rowMaker, utility, data, choiceMaker, currentNode, connector) {
        this.rowMaker = rowMaker;
        this.utility = utility;
        this.data = data;
        this.choiceMaker = choiceMaker;
        this.currentNode = currentNode;
        this.connector = connector;
        this.ptrDown = this.onPointerDown.bind(this);
        this.ptrMove = this.onPointerMove.bind(this);
        this.ptrUp = this.onPointerUp.bind(this);
    }
    node(nodeId) {
        const element = document.createElementNS(this.data.SVGNS, "svg");
        element.id = "node-" + nodeId;
        element.dataset.nodeId = nodeId;
        element.classList.add("node");
        element.style.width = this.data.NODE_WIDTH + "px";
        const header = document.createElementNS(this.data.SVGNS, "svg");
        header.id = "node-header-" + nodeId;
        header.classList.add("node-header");
        const headerText = document.createElementNS(this.data.SVGNS, "text");
        headerText.id = "node-header-text-" + nodeId;
        headerText.setAttribute("x", "0");
        headerText.setAttribute("y", "17");
        headerText.setAttribute("fill", "white");
        headerText.style.width = this.data.NODE_WIDTH + "px";
        const row = this.rowMaker.layoutRow();
        const rect = row.children[0];
        rect.setAttribute("fill", "red");
        const sockets = this.rowMaker.sockets(nodeId);
        sockets.socketLeft.style.display = "none";
        sockets.socketRight.style.display = "none";
        row.append(sockets.socketLeft, headerText, sockets.socketRight);
        header.appendChild(row);
        const body = document.createElementNS(this.data.SVGNS, "svg");
        body.id = "node-body-" + nodeId;
        body.classList.add("node-body");
        header.addEventListener('pointerdown', this.ptrDown);
        element.appendChild(header);
        element.appendChild(body);
        element.addEventListener('click', this.loadNodeIntoEditor.bind(this));
        return element;
    }
    // Function to handle the start of the drag
    onPointerDown(event) {
        const element = event.currentTarget;
        element.setPointerCapture(event.pointerId);
        element.addEventListener('pointermove', this.ptrMove);
        element.addEventListener('pointerup', this.ptrUp);
        element.dataset.startX = event.clientX;
        element.dataset.startY = event.clientY;
        const nodeElement = element.parentElement;
        element.dataset.initX = parseFloat(nodeElement.getAttribute("x")) || 0;
        element.dataset.initY = parseFloat(nodeElement.getAttribute("y")) || 0;
    }
    // Function to handle the movement during drag
    onPointerMove(event) {
        var _a, _b;
        const element = event.currentTarget;
        const deltaX = event.clientX - element.dataset.startX;
        const deltaY = event.clientY - element.dataset.startY;
        const newX = parseFloat(element.dataset.initX) + deltaX;
        const newY = parseFloat(element.dataset.initY) + deltaY;
        const nodeElement = element.parentElement;
        nodeElement.setAttribute("x", newX.toString());
        nodeElement.setAttribute("y", newY.toString());
        this.data.nodes.get(nodeElement.dataset.nodeId).position = { x: newX, y: newY };
        // TODO: get the incoming and outgoing paths by nodeId.
        const nodeId = nodeElement.dataset.nodeId;
        (_a = this.data.incoming.get(nodeId)) === null || _a === void 0 ? void 0 : _a.forEach(socketsConnection => {
            // set the path ending coords
            const socketCenter = this.connector.getSocketCenter(socketsConnection.socketTo);
            this.connector.setPathEndPoint(socketsConnection.path, socketCenter.x, socketCenter.y);
        });
        (_b = this.data.outgoing.get(nodeId)) === null || _b === void 0 ? void 0 : _b.forEach(socketsConnection => {
            // set the path beginning coords
            const socketCenter = this.connector.getSocketCenter(socketsConnection.socketFrom);
            this.connector.setPathStartPoint(socketsConnection.path, socketCenter.x, socketCenter.y);
        });
    }
    // Function to handle the end of the drag
    onPointerUp(event) {
        const element = event.currentTarget;
        element.releasePointerCapture(event.pointerId);
        element.removeEventListener('pointermove', this.ptrMove);
        element.removeEventListener('pointerup', this.ptrUp);
        // Update node position        
        const node = element.parentElement;
        const nodeId = node.dataset.nodeId;
        this.data.nodes.get(nodeId).position = {
            x: parseFloat(node.getAttribute("x")),
            y: parseFloat(node.getAttribute("y"))
        };
    }
    loadNodeIntoEditor(event) {
        event.stopPropagation();
        const element = event.currentTarget;
        const nodeId = element.dataset.nodeId;
        this.choiceMaker.changeNode(nodeId);
    }
}
//# sourceMappingURL=NodeLayout.js.map