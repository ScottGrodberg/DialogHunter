export class NodeLayout {
    constructor(rowMaker, utility, data, choiceMaker, currentNode, connector, lineMaker) {
        this.rowMaker = rowMaker;
        this.utility = utility;
        this.data = data;
        this.choiceMaker = choiceMaker;
        this.currentNode = currentNode;
        this.connector = connector;
        this.lineMaker = lineMaker;
        this.ptrDown = this.onPointerDown.bind(this);
        this.ptrMove = this.onPointerMove.bind(this);
        this.ptrUp = this.onPointerUp.bind(this);
    }
    node(nodeId) {
        const element = document.createElement("div");
        element.id = "node-" + nodeId;
        element.dataset.nodeId = nodeId;
        element.style.width = NodeLayout.DEFAULT_WIDTH + "px";
        element.style.padding = "10px";
        element.style.backgroundColor = "black";
        element.style.position = "absolute";
        element.style.boxShadow = "0 0 20px 9px rgba(0, 0, 0, 0.25)";
        const header = document.createElement("div");
        header.id = "node-header-" + nodeId;
        header.style.width = "100%";
        header.style.height = "3em";
        header.style.backgroundColor = "blue";
        header.style.cursor = "pointer";
        const headerText = document.createElement("p");
        headerText.id = "node-header-text-" + nodeId;
        headerText.style.color = "white";
        const row = this.rowMaker.row();
        const sockets = this.rowMaker.sockets(nodeId);
        sockets.socketLeft.style.display = "none";
        sockets.socketRight.style.display = "none";
        row.append(sockets.socketLeft, headerText, sockets.socketRight);
        header.appendChild(row);
        const body = document.createElement("div");
        body.id = "node-body-" + nodeId;
        body.style.width = "100%";
        body.style.minHeight = "5em";
        body.style.backgroundColor = "red";
        body.style.paddingTop = "0.4em";
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
        element.dataset.initX = parseFloat(nodeElement.style.left) || 0;
        element.dataset.initY = parseFloat(nodeElement.style.top) || 0;
    }
    // Function to handle the movement during drag
    onPointerMove(event) {
        var _a, _b;
        const element = event.target;
        const deltaX = event.clientX - element.dataset.startX;
        const deltaY = event.clientY - element.dataset.startY;
        const newX = parseFloat(element.dataset.initX) + deltaX;
        const newY = parseFloat(element.dataset.initY) + deltaY;
        const nodeElement = element.parentElement;
        nodeElement.style.left = newX + "px";
        nodeElement.style.top = newY + "px";
        this.data.nodes.get(nodeElement.dataset.nodeId).position = { left: newX, top: newY };
        // TODO: get the incoming and outgoing lines by nodeId.
        const nodeId = nodeElement.dataset.nodeId;
        (_a = this.data.incoming.get(nodeId)) === null || _a === void 0 ? void 0 : _a.forEach(socketsConnection => {
            // set the line ending coords
            const socketCenter = this.lineMaker.getSocketCenter(socketsConnection.socketTo);
            socketsConnection.line.setAttribute("x2", socketCenter.x + "px");
            socketsConnection.line.setAttribute("y2", socketCenter.y + "px");
        });
        (_b = this.data.outgoing.get(nodeId)) === null || _b === void 0 ? void 0 : _b.forEach(socketsConnection => {
            // set the line beginning coords
            const socketCenter = this.lineMaker.getSocketCenter(socketsConnection.socketFrom);
            socketsConnection.line.setAttribute("x1", socketCenter.x + "px");
            socketsConnection.line.setAttribute("y1", socketCenter.y + "px");
        });
    }
    // Function to handle the end of the drag
    onPointerUp(event) {
        const element = event.target;
        element.releasePointerCapture(event.pointerId);
        element.removeEventListener('pointermove', this.ptrMove);
        element.removeEventListener('pointerup', this.ptrUp);
        // Update node position        
        const node = element.parentElement;
        const nodeId = node.dataset.nodeId;
        this.data.nodes.get(nodeId).position = { left: node.style.left, top: node.style.top };
    }
    loadNodeIntoEditor(event) {
        event.stopPropagation();
        const element = event.currentTarget;
        const nodeId = element.dataset.nodeId;
        this.choiceMaker.changeNode(nodeId);
    }
}
NodeLayout.DEFAULT_WIDTH = 150;
//# sourceMappingURL=NodeLayout.js.map