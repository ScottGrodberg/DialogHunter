import { ChoiceMaker } from "./ChoiceMaker.js";
import { Connector } from "./Connector.js";
import { CurrentNode } from "./CurrentNode.js";
import { Data, NodeId } from "./Data.js";
import { PathMaker } from "./PathMaker.js";
import { RowMaker } from "./RowMaker.js";
import { Utility } from "./Utility.js";

export class NodeLayout {
    static DEFAULT_WIDTH = 150;

    ptrDown: (event: any) => void;
    ptrMove: (event: any) => void;
    ptrUp: (event: any) => void;

    constructor(public rowMaker: RowMaker, public utility: Utility, public data: Data, public choiceMaker: ChoiceMaker, public currentNode: CurrentNode, public connector: Connector, public pathMaker: PathMaker) {
        this.ptrDown = this.onPointerDown.bind(this);
        this.ptrMove = this.onPointerMove.bind(this);
        this.ptrUp = this.onPointerUp.bind(this);
    }

    node(nodeId: NodeId): HTMLDivElement {

        const element = document.createElement("div");
        element.id = "node-" + nodeId;
        element.dataset.nodeId = nodeId;
        element.classList.add("node");
        element.style.width = NodeLayout.DEFAULT_WIDTH + "px";

        const header = document.createElement("div");
        header.id = "node-header-" + nodeId;
        header.classList.add("node-header");

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
        const element = event.target;
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
            const socketCenter = this.pathMaker.getSocketCenter(socketsConnection.socketTo);
            const oldPathData = socketsConnection.path.getAttribute("d")!.split(" ");
            const newPathData = `M ${oldPathData[1]} ${oldPathData[2]} L ${socketCenter.x} ${socketCenter.y}`;
            socketsConnection.path.setAttribute("d", newPathData);
        });
        this.data.outgoing.get(nodeId)?.forEach(socketsConnection => {
            // set the path beginning coords
            const socketCenter = this.pathMaker.getSocketCenter(socketsConnection.socketFrom);
            const oldPathData = socketsConnection.path.getAttribute("d")!.split(" ");
            const newPathData = `M ${socketCenter.x} ${socketCenter.y} L ${oldPathData[4]} ${oldPathData[5]}`;
            socketsConnection.path.setAttribute("d", newPathData);
        });
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
        const nodeId = element.dataset.nodeId!;

        this.choiceMaker.changeNode(nodeId);

    }

}