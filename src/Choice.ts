import { ChoiceId, NodeId } from "./Data";

export class Choice {

    key?: string;         // shortcut or hot key, should be unique among all choices for a node
    sentence?: string;    // statement or question or description    
    nodeId?: NodeId;     // link to

    constructor(public choiceId: ChoiceId) { }

}