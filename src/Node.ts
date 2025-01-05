import { ChoiceId, NodeId } from "./Data";

export class Node {
    position?: { x: number, y: number };
    choices: Array<ChoiceId>

    constructor(public nodeId: NodeId, public text: string) {
        this.choices = new Array();
    }
}