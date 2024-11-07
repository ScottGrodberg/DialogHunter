import { ChoiceId, NodeId } from "./Data";

export class Choice {

    key?: string;         // shortcut or hot key, should be unique among all choices for a node
    nodeId?: NodeId;     // this choice links to this nodeId

    constructor(public choiceId: ChoiceId, public text: string) { }

}