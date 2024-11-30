import { Choice } from "./Choice";
import { Node, NodeType } from "./Node.js";

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

        output += `[\n`;
        this.nodes.forEach(node => {
            output += `  {\n`;
            output += `    "nodeId":"${node.nodeId}",\n`;
            output += `    "nodeType":"${NodeType[node.nodeType]}",\n`;
            output += `    "text":${JSON.stringify(node.text)},\n`;
            output += `    "choices":[\n`;
            let choices = ``;
            node.choices.forEach(choiceId => choices += `      ${JSON.stringify(this.choices.get(choiceId))},\n`);

            output += `${choices.substring(0, choices.length - 2)}\n`;
            output += `    ]\n`;
            output += `  },\n`;
        });
        output = `${output.substring(0, output.length - 2)}\n`;
        output += `]\n`;

        document.getElementById("div-output")!.innerHTML = output;
    }

}