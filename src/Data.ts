import { Choice } from "./Choice";
import { Node } from "./Node";

export type NodeId = string;
export type ChoiceId = string;
export type Line = SVGElement;


export class Data {

    // Elements

    // Top section - layout
    divLayoutWrapper?: HTMLDivElement;
    divLayout?: HTMLDivElement;
    svgLayout?: SVGElement;

    // Bottom section - editor
    divEditorWrapper?: HTMLDivElement;


    // Data 
    head?: NodeId;              // The starting node for the interchange
    currentNodeId?: NodeId;     // The nodeId currently in the editory

    nodes = new Map<NodeId, Node>();
    choices = new Map<ChoiceId, Choice>();

    // Node connections, hold refs to Line objects
    incoming = new Map<NodeId, Map<NodeId, Line>>();  // Connections from values to the key
    outgoing = new Map<NodeId, Map<NodeId, Line>>();  // Connections from the key to values

    /**
     * Create or update rows for the given node
     * @param nodeId 
     */
    update(nodeId: NodeId) {
        const body = document.getElementById(`node-body-${nodeId}`);
        console.log(`${body}`);
    }
}