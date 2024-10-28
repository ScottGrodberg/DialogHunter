import { ChoiceId } from "./Data";

export class Node {
    position?: { top: number, left: number };
    choices: Array<ChoiceId>

    constructor() {
        this.choices = new Array();
    }
}