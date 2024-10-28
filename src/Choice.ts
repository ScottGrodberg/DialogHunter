import { ChoiceId, NodeId } from "./Data";

export class Choice {

    key?: string;         // shortcut or hot key, should be unique among all choices for a node
    sentence?: string;    // statement or question or description    
    nodeId?: NodeId;     // this choice links to this node

    constructor(public choiceId: ChoiceId) { }

}