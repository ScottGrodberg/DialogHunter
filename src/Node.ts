import { ChoiceId, NodeId } from "./Data";

export class Node {
    position?: { top: number, left: number };
    choices: Array<ChoiceId>

    constructor(public nodeId: NodeId, public text: string) {
        this.choices = new Array();
    }
}