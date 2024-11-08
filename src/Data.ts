import { Choice } from "./Choice";
import { Node } from "./Node";

export type NodeId = string;
export type ChoiceId = string;
export type Path = SVGElement;

export type SocketsConnection = {
    socketFrom: HTMLElement;
    path: Path;
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

    // Convenience variables
    head?: NodeId;              // The starting node for the interchange
    currentNodeId?: NodeId;     // The nodeId currently in the editory

    // Data structures, meant to be serialized to storage
    nodes = new Map<NodeId, Node>();
    choices = new Map<ChoiceId, Choice>();

    // Node connections, holds DOM objects, not meant for serialization
    incoming = new Map<NodeId, Map<NodeId, SocketsConnection>>();  // Connections from values to the key
    outgoing = new Map<NodeId, Map<NodeId, SocketsConnection>>();  // Connections from the key to values

    dump() {
        let output = "";

        output += `[`;
        this.nodes.forEach(node => {
            output += `{\n`;
            output += `  "nodeId":"${node.nodeId}",\n`;
            output += `  "text":"${node.text}",\n`;
            output += `  "choices":[\n`;
            output += `    ${node.choices.map(choiceId => JSON.stringify(this.choices.get(choiceId)))}\n`;
            output += `  ]\n`;
            output += `},\n`;
        });
        output += `]\n`;

        document.getElementById("div-output")!.innerHTML = output;
    }

}