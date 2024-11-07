import { ChoiceId, NodeId } from "./Data";

export class Choice {

    key?: string;         // shortcut or hot key, should be unique among all choices for a node
    text?: string;
    nodeId?: NodeId;     // this choice links to this nodeId

    constructor(public choiceId: ChoiceId) { }

}