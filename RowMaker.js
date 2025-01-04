export class RowMaker {
    constructor(data, connector, utility) {
        this.data = data;
        this.connector = connector;
        this.utility = utility;
    }
    editorRow() {
        const element = document.createElement("div");
        element.classList.add("choice");
        return element;
    }
    layoutRow() {
        const rect = document.createElementNS(this.data.SVGNS, "rect");
        rect.setAttribute("width", this.data.NODE_WIDTH.toString());
        rect.setAttribute("height", "3em");
        const element = document.createElementNS(this.data.SVGNS, "svg");
        element.classList.add("choice");
        element.append(rect);
        return element;
    }
    sockets(nodeId, choiceId) {
        // Make a socket
        const socket = document.createElementNS(this.data.SVGNS, "circle");
        socket.setAttribute("r", "7");
        socket.setAttribute("cy", "27");
        socket.dataset.nodeId = nodeId;
        socket.classList.add("socket");
        // Clone for the left
        const socketLeft = socket.cloneNode();
        socketLeft.id = "socket-" + this.utility.generateUid(8) + "-left";
        socketLeft.setAttribute("cx", "0");
        // Clone for the right
        const socketRight = socket.cloneNode();
        socketRight.id = "socket-" + this.utility.generateUid(8) + "-right";
        socketRight.setAttribute("cx", `${this.data.NODE_WIDTH}`);
        if (choiceId) {
            // body sockets, outgoing from choices
            socketLeft.dataset.choiceId = choiceId;
            socketRight.dataset.choiceId = choiceId;
            socketLeft.addEventListener('pointerdown', this.connector.onPointerDown.bind(this.connector));
            socketRight.addEventListener('pointerdown', this.connector.onPointerDown.bind(this.connector));
        }
        else {
            // header sockets, incoming from choices
            socketLeft.addEventListener('pointerdown', (event) => { event.stopPropagation(); });
            socketRight.addEventListener('pointerdown', (event) => { event.stopPropagation(); });
        }
        return { socketLeft, socketRight };
    }
}
//# sourceMappingURL=RowMaker.js.map