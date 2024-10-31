import { ChoiceId, NodeId } from "./Data";

export class Node {
    position?: { top: number, left: number };
    text?: string; // statement or question or description

    choices: Array<ChoiceId>

    constructor(public nodeId: NodeId) {
        this.choices = new Array();
    }
}