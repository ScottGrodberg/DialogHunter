import { Connector } from "./Connector";
import { Data } from "./Data";
import { Utility } from "./Utility";

export class RowMaker {


    constructor(public data: Data, public connector: Connector, public utility: Utility) { }

    editorRow(): HTMLDivElement {
        const element = document.createElement("div");
        element.classList.add("choice");
        return element;
    }

    layoutRow(): SVGElement {
        const rect = document.createElementNS(this.data.SVGNS, "rect");
        rect.setAttribute("width", this.data.NODE_WIDTH.toString());
        rect.setAttribute("height", "3em");
        const element = document.createElementNS(this.data.SVGNS, "svg") as SVGElement;
        element.classList.add("choice");
        element.append(rect);
        return element;
    }

    sockets(nodeId: string, choiceId?: string): { socketLeft: SVGElement, socketRight: SVGElement } {

        // Make a socket
        const socket = document.createElementNS(this.data.SVGNS, "circle") as SVGElement;
        socket.setAttribute("r", "7");
        socket.setAttribute("cy", "27");
        socket.dataset.nodeId = nodeId;
        socket.classList.add("socket");

        // Clone for the left
        const socketLeft = socket.cloneNode() as SVGElement;
        socketLeft.id = "socket-" + this.utility.generateUid(8) + "-left";
        socketLeft.setAttribute("cx", "0");

        // Clone for the right
        const socketRight = socket.cloneNode() as SVGElement;
        socketRight.id = "socket-" + this.utility.generateUid(8) + "-right";
        socketRight.setAttribute("cx", `${this.data.NODE_WIDTH}`);

        if (choiceId) {
            // body sockets, outgoing from choices
            socketLeft.dataset.choiceId = choiceId;
            socketRight.dataset.choiceId = choiceId;
            socketLeft.addEventListener('pointerdown', this.connector.onPointerDown.bind(this.connector));
            socketRight.addEventListener('pointerdown', this.connector.onPointerDown.bind(this.connector));
        } else {
            // header sockets, incoming from choices
            socketLeft.addEventListener('pointerdown', (event) => { event.stopPropagation() });
            socketRight.addEventListener('pointerdown', (event) => { event.stopPropagation() });
        }

        return { socketLeft, socketRight };
    }
}