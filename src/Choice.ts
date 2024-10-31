import { ChoiceId, NodeId } from "./Data";

export class Choice {

    key?: string;         // shortcut or hot key, should be unique among all choices for a node
    response?: string;    // the text of the response
    nodeId?: NodeId;     // this choice links to this nodeId

    constructor(public choiceId: ChoiceId) { }

}