export class RowMaker {
    constructor(connector, utility) {
        this.connector = connector;
        this.utility = utility;
    }
    row() {
        const element = document.createElement("div");
        element.classList.add("choice");
        return element;
    }
    sockets(nodeId, choiceId) {
        // Make a socket
        const socket = document.createElement("div");
        socket.dataset.nodeId = nodeId;
        socket.className = "socket";
        // Clone for the left
        const socketLeft = socket.cloneNode();
        socketLeft.id = "socket-" + this.utility.generateUid(8) + "-left";
        socketLeft.classList.add("socket-left");
        // Clone for the right
        const socketRight = socket.cloneNode();
        socketRight.id = "socket-" + this.utility.generateUid(8) + "-right";
        socketRight.classList.add("socket-right");
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