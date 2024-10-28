import { ChoiceId, NodeId } from "./Data";

export class Node {
    position?: { top: number, left: number };
    choices: Array<ChoiceId>

    constructor(public nodeId: NodeId) {
        this.choices = new Array();
    }
}