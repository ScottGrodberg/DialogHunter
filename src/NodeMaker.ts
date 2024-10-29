import { ChoiceMaker } from "./ChoiceMaker.js";
import { Data, NodeId } from "./Data.js";
import { RowMaker } from "./RowMaker.js";
import { Utility } from "./Utility.js";

export class NodeMaker {
    static DEFAULT_WIDTH = 150;

    ptrDown: (event: any) => void;
    ptrMove: (event: any) => void;
    ptrUp: (event: any) => void;

    constructor(public rowMaker: RowMaker, public utility: Utility, public data: Data, public choiceMaker: ChoiceMaker) {
        this.ptrDown = this.onPointerDown.bind(this);
        this.ptrMove = this.onPointerMove.bind(this);
        this.ptrUp = this.onPointerUp.bind(this);
    }

    node(nodeId: NodeId): HTMLDivElement {

        const element = document.createElement("div");
        element.id = "node-" + nodeId;
        element.dataset.nodeId = nodeId;
        element.style.width = NodeMaker.DEFAULT_WIDTH + "px";
        element.style.padding = "10px";
        element.style.backgroundColor = "black";
        element.style.position = "absolute";
        element.style.boxShadow = "0 0 20px 9px rgba(0, 0, 0, 0.25)";

        const header = document.createElement("div");
        header.style.width = "100%";
        header.style.height = "30px";
        header.style.backgroundColor = "blue";
        header.style.cursor = "pointer";

        const row = this.rowMaker.row();
        const sockets = this.rowMaker.sockets(nodeId);
        sockets.socketLeft.style.display = "none";
        sockets.socketRight.style.display = "none";
        row.append(sockets.socketLeft, sockets.socketRight);
        header.appendChild(row);

        const body = document.createElement("div");
        body.style.width = "100%";
        body.style.minHeight = "120px";
        body.style.backgroundColor = "red";

        header.addEventListener('pointerdown', this.ptrDown);

        element.appendChild(header);
        element.appendChild(body);

        element.addEventListener('click', this.loadNodeIntoEditor.bind(this));

        return element;
    }

    // Function to handle the start of the drag
    onPointerDown(event: any) {
        const element = event.target;
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
    onPointerMove(event: any) {
        const element = event.target;
        const deltaX = event.clientX - element.dataset.startX;
        const deltaY = event.clientY - element.dataset.startY;
        const newX = parseFloat(element.dataset.initX) + deltaX;
        const newY = parseFloat(element.dataset.initY) + deltaY;
        const nodeElement = element.parentElement;
        nodeElement.style.left = newX + "px";
        nodeElement.style.top = newY + "px";

        // TODO: get the incoming and outgoing lines by nodeId. 
        // For the incoming, update x2 and y2. For outgoing, update x1 and y1
    }

    // Function to handle the end of the drag
    onPointerUp(event: any) {
        const element = event.target;
        element.releasePointerCapture(event.pointerId);
        element.removeEventListener('pointermove', this.ptrMove);
        element.removeEventListener('pointerup', this.ptrUp);

        // Update node position        
        const node = element.parentElement;
        const nodeId = node.dataset.nodeId;
        this.data.nodes.get(nodeId)!.position = { left: node.style.left, top: node.style.top };
    }

    loadNodeIntoEditor(event: Event) {
        event.stopPropagation();
        const element = event.currentTarget as HTMLElement;
        const nodeId = element.dataset.nodeId;

        console.log(`Got click at node ${nodeId}`);
        this.data.currentNodeId = nodeId;

    }

}