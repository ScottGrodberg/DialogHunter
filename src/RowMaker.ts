import { Connector } from "./Connector";
import { Utility } from "./Utility";

export class RowMaker {

    constructor(public connector: Connector, public utility: Utility) { }

    row(): HTMLDivElement {
        const element = document.createElement("div");
        element.style.display = "flex";
        element.style.flexDirection = "row";
        element.style.position = "relative";
        return element;
    }

    sockets(nodeId: string, choiceId?: string): { socketLeft: HTMLDivElement, socketRight: HTMLDivElement } {

        // Make a socket
        const socket = document.createElement("div");
        socket.dataset.nodeId = nodeId;
        if (choiceId) {
            socket.dataset.choiceId = choiceId;
        }
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
        const socketLeft = socket.cloneNode() as HTMLDivElement;
        socketLeft.style.left = "-18px";
        socketLeft.addEventListener('pointerdown', this.connector.onPointerDown.bind(this.connector)); // FIXME: proper binding so it can be unbound when the outgoing connection is completed        
        socketLeft.id = "socket-" + this.utility.generateUid(8) + "-left";

        // Clone for the right
        const socketRight = socket.cloneNode() as HTMLDivElement;
        socketRight.style.left = "calc(100% + 2px)";
        socketRight.addEventListener('pointerdown', this.connector.onPointerDown.bind(this.connector)); // FIXME: (see above)
        socketRight.id = "socket-" + this.utility.generateUid(8) + "-right";

        return { socketLeft, socketRight };
    }
}