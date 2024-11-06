export class RowMaker {
    constructor(connector, utility) {
        this.connector = connector;
        this.utility = utility;
    }
    row() {
        const element = document.createElement("div");
        element.style.display = "flex";
        element.style.flexDirection = "row";
        element.style.position = "relative";
        return element;
    }
    sockets(nodeId, choiceId) {
        // Make a socket
        const socket = document.createElement("div");
        socket.dataset.nodeId = nodeId;
        socket.style.borderRadius = "50%";
        socket.style.backgroundColor = "white";
        socket.style.width = "14px";
        socket.style.height = "14px";
        socket.style.position = "absolute";
        socket.style.border = "1px solid black";
        socket.style.top = "10px";
        socket.style.cursor = "pointer";
        socket.className = "socket";
        // Clone for the left
        const socketLeft = socket.cloneNode();
        socketLeft.style.left = "-18px";
        socketLeft.id = "socket-" + this.utility.generateUid(8) + "-left";
        // Clone for the right
        const socketRight = socket.cloneNode();
        socketRight.style.left = "calc(100% + 2px)";
        socketRight.id = "socket-" + this.utility.generateUid(8) + "-right";
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