import { Choice } from "./Choice";
import { Node } from "./Node";

export type NodeId = string;
export type ChoiceId = string;
export type Line = SVGElement;

export type SocketsConnection = {
    socketFrom: HTMLElement;
    line: Line;
    socketTo: HTMLElement;
}
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
    incoming = new Map<NodeId, Map<NodeId, SocketsConnection>>();  // Connections from values to the key
    outgoing = new Map<NodeId, Map<NodeId, SocketsConnection>>();  // Connections from the key to values

    dump() {
        this.nodes.forEach(node => {
            console.log(`{`);
            console.log(`  "nodeId": "${node.nodeId}"`);
            console.log(`  "text": "${node.text}"`);
            console.log(`  "choices" : [`);
            console.log(`    ${node.choices.map(choiceId => JSON.stringify(this.choices.get(choiceId)))}`);
            console.log(`  ]`);
            console.log(`},`);
        });
    }

}