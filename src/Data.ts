
export type NodeId = string;
export type ChoiceId = string;
export type Line = SVGElement;

export type Node = {
    position: { top: number, left: number },
    choices: Array<ChoiceId>
}
export type Choice = {
    choiceId: ChoiceId;
    key: string;         // shortcut or hot key, should be unique among all choices for a node
    sentence: string;    // statement or question or description    
    nodeId?: NodeId;     // link to
}
export class Data {

    nodes = new Map<NodeId, Node>();
    choices = new Map<ChoiceId, Choice>();

    // Node connections
    incoming = new Map<NodeId, Map<NodeId, Line>>();  // Connections from values to the key
    outgoing = new Map<NodeId, Map<NodeId, Line>>();  // Connections from the key to values

}