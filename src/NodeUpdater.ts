import { ChoiceMaker } from "./ChoiceMaker";
import { Data, NodeId } from "./Data";

export enum ChoiceFor {
    LAYOUT, EDITOR
}
export class NodeUpdater {

    constructor(public data: Data, public choiceMaker: ChoiceMaker) {
    }
    /**
     * Create or update rows for the given node. Called after the data has been changed and needs to be reflected in the ui
     * @param nodeId 
     */
    update(nodeId: NodeId, destination: HTMLElement, choiceFor: ChoiceFor) {

        // Clear all rows from the body
        destination.innerHTML = ``;

        const node = this.data.nodes.get(nodeId)!;
        const choices = node.choices;
        choices.forEach(choice => {
            let element: HTMLElement;
            if (choiceFor === ChoiceFor.LAYOUT) {
                element = this.choiceMaker.choiceForLayout(nodeId, choice);
            } else {
                element = this.choiceMaker.choiceForEditor(nodeId, choice);
            }
            destination.appendChild(element);
        })


    }
}