import { ChoiceId, NodeId } from "./Data";

export enum NodeType {
    INTR,
    ROLL
}

export class Node {
    position?: { top: number, left: number };
    choices: Array<ChoiceId>

    constructor(public nodeId: NodeId, public nodeType: NodeType, public text: string) {
        this.choices = new Array();
    }
}