import { ChoiceMaker } from "./ChoiceMaker.js";
import { Connector } from "./Connector.js";
import { CurrentNode } from "./CurrentNode.js";
import { Data, NodeId } from "./Data.js";
import { RowMaker } from "./RowMaker.js";
import { Utility } from "./Utility.js";

export class NodeLayout {

    ptrDown: (event: any) => void;
    ptrMove: (event: any) => void;
    ptrUp: (event: any) => void;

    constructor(public rowMaker: RowMaker, public utility: Utility, public data: Data, public choiceMaker: ChoiceMaker, public currentNode: CurrentNode, public connector: Connector) {
        this.ptrDown = this.onPointerDown.bind(this);
        this.ptrMove = this.onPointerMove.bind(this);
        this.ptrUp = this.onPointerUp.bind(this);
    }

    node(nodeId: NodeId): SVGElement {

        const element = document.createElementNS(this.data.SVGNS, "svg") as SVGElement
        element.id = "node-" + nodeId;
        element.dataset.nodeId = nodeId;
        element.classList.add("node");
        element.style.width = this.data.NODE_WIDTH + "px";

        const header = document.createElementNS(this.data.SVGNS, "svg");
        header.id = "node-header-" + nodeId;
        header.classList.add("node-header");

        const headerText = document.createElementNS(this.data.SVGNS, "text") as SVGElement;
        headerText.id = "node-header-text-" + nodeId;
        headerText.setAttribute("x", "0");
        headerText.setAttribute("y", "17");
        headerText.setAttribute("fill", "white");
        headerText.style.width = this.data.NODE_WIDTH + "px";


        const row = this.rowMaker.layoutRow();
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
    onPointerDown(event: any) {
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
    onPointerMove(event: any) {
        const element = event.currentTarget;
        const deltaX = event.clientX - element.dataset.startX;
        const deltaY = event.clientY - element.dataset.startY;
        const newX = parseFloat(element.dataset.initX) + deltaX;
        const newY = parseFloat(element.dataset.initY) + deltaY;
        const nodeElement = element.parentElement;
        nodeElement.style.left = newX + "px";
        nodeElement.style.top = newY + "px";
        this.data.nodes.get(nodeElement.dataset.nodeId)!.position = { left: newX, top: newY };

        // TODO: get the incoming and outgoing paths by nodeId.
        const nodeId = nodeElement.dataset.nodeId;

        this.data.incoming.get(nodeId)?.forEach(socketsConnection => {
            // set the path ending coords
            const socketCenter = this.connector.getSocketCenter(socketsConnection.socketTo);
            this.connector.setPathEndPoint(socketsConnection.path, socketCenter.x, socketCenter.y);
        });
        this.data.outgoing.get(nodeId)?.forEach(socketsConnection => {
            // set the path beginning coords
            const socketCenter = this.connector.getSocketCenter(socketsConnection.socketFrom);
            this.connector.setPathStartPoint(socketsConnection.path, socketCenter.x, socketCenter.y);
        });
    }

    // Function to handle the end of the drag
    onPointerUp(event: any) {
        const element = event.currentTarget;
        element.releasePointerCapture(event.pointerId);
        element.removeEventListener('pointermove', this.ptrMove);
        element.removeEventListener('pointerup', this.ptrUp);

        // Update node position        
        const node = element.parentElement;
        const nodeId = node.dataset.nodeId;
        this.data.nodes.get(nodeId)!.position = { left: parseFloat(node.style.left), top: parseFloat(node.style.top) };
    }

    loadNodeIntoEditor(event: Event) {
        event.stopPropagation();
        const element = event.currentTarget as HTMLElement;
        const nodeId = element.dataset.nodeId!;

        this.choiceMaker.changeNode(nodeId);

    }

}