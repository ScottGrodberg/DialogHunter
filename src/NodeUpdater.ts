import { ChoiceMaker } from "./ChoiceMaker";
import { Data, NodeId } from "./Data";

export class NodeUpdater {

    constructor(public data: Data, public choiceMaker: ChoiceMaker) {
    }
    /**
     * Create or update rows for the given node. Called after the data has been changed and needs to be reflected in the ui
     * @param nodeId 
     */
    update(nodeId: NodeId) {
        const body = document.getElementById(`node-body-${nodeId}`)!;

        // Clear all rows from the body
        body.innerHTML = ``;

        // 
        const node = this.data.nodes.get(nodeId)!;
        const choices = node.choices;
        choices.forEach(choice => {
            const element = this.choiceMaker.choiceForLayout(nodeId, choice);
            body.appendChild(element);
        })


    }
}