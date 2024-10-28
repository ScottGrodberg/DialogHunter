import { Choice } from "./Choice";
import { Node } from "./Node";

export type NodeId = string;
export type ChoiceId = string;
export type Line = SVGElement;


export class Data {

    nodes = new Map<NodeId, Node>();
    choices = new Map<ChoiceId, Choice>();

    // Node connections
    incoming = new Map<NodeId, Map<NodeId, Line>>();  // Connections from values to the key
    outgoing = new Map<NodeId, Map<NodeId, Line>>();  // Connections from the key to values

}