export var ChoiceFor;
(function (ChoiceFor) {
    ChoiceFor[ChoiceFor["LAYOUT"] = 0] = "LAYOUT";
    ChoiceFor[ChoiceFor["EDITOR"] = 1] = "EDITOR";
})(ChoiceFor || (ChoiceFor = {}));
export class ChoiceMaker {
    constructor(data, rowMaker, currentNode) {
        this.data = data;
        this.rowMaker = rowMaker;
        this.currentNode = currentNode;
    }
    choiceForLayout(nodeId, choiceId) {
        const element = this.makeRow(nodeId, choiceId);
        const { socketLeft, socketRight } = this.rowMaker.sockets(nodeId, choiceId);
        const value = this.makeResponseReadOnly(choiceId);
        value.style.width = "100%";
        element.append(socketLeft, value, socketRight);
        return element;
    }
    choiceForEditor(nodeId, choiceId) {
        const element = this.makeRow(nodeId, choiceId);
        const key = this.makeKey();
        key.style.width = "30px";
        const value = this.makeResponse(choiceId);
        value.style.width = "calc(100% - 30px - 30px)";
        const x = this.makeX();
        x.style.width = "30px";
        const arrow = this.makeNextArrow(choiceId);
        arrow.style.width = "30px";
        //element.append(key,value,x);
        element.append(x, value, arrow);
        return element;
    }
    makeRow(nodeId, choiceId) {
        const element = this.rowMaker.row();
        element.id = "choice-" + choiceId;
        element.dataset.nodeId = nodeId;
        element.dataset.choiceId = choiceId;
        return element;
    }
    makeKey() {
        const key = document.createElement("input");
        key.oninput = (event) => {
            const element = event.target;
            element.value = element.value.substring(0, 1);
        };
        return key;
    }
    makeResponse(choiceId) {
        const response = document.createElement("textarea");
        response.style.resize = "vertical";
        response.innerHTML = this.data.choices.get(choiceId).text;
        response.title = response.innerHTML;
        response.onchange = () => {
            this.data.choices.get(choiceId).text = response.value;
            const destination = document.getElementById(`node-body-${this.data.currentNodeId}`);
            this.update(this.data.currentNodeId, destination, ChoiceFor.LAYOUT);
        };
        return response;
    }
    makeResponseReadOnly(choiceId) {
        const response = document.createElement("p");
        response.innerHTML = this.data.choices.get(choiceId).text;
        response.title = response.innerHTML;
        return response;
    }
    makeNextArrow(choiceId) {
        var _a;
        const arrow = document.createElement("button");
        arrow.innerHTML = ">";
        // determine if there is an outgoing connection from this choice
        // If there is then show the arrow
        if ((_a = this.data.choices.get(choiceId)) === null || _a === void 0 ? void 0 : _a.nodeId) {
            arrow.style.visibility = "visible";
        }
        else {
            arrow.style.visibility = "hidden";
        }
        arrow.onclick = (event) => {
            var _a;
            const nodeId = (_a = this.data.choices.get(choiceId)) === null || _a === void 0 ? void 0 : _a.nodeId;
            console.log(`Choice ${choiceId} clicked arrow, next node is ${nodeId}`);
            if (!nodeId) {
                return;
            }
            this.changeNode(nodeId);
        };
        return arrow;
    }
    makeX() {
        const x = document.createElement("button");
        x.innerHTML = "X";
        x.onclick = (event) => {
            // Delete the element
            const element = event.target.parentElement;
            const nodeId = element.dataset.nodeId;
            const choiceId = element.dataset.choiceId;
            element.remove();
            // Delete the data
            const nodeIdTo = this.data.choices.get(choiceId).nodeId;
            this.data.choices.delete(choiceId);
            const node = this.data.nodes.get(nodeId);
            node.choices = node.choices.filter(_choiceId => _choiceId !== choiceId);
            // Delete the connection
            if (nodeIdTo) {
                const node = this.data.outgoing.get(nodeId);
                node.get(nodeIdTo).line.remove(); // remove the line
                node.delete(nodeIdTo); // delete the outgoing connection                
            }
            const destination = document.getElementById(`node-body-${nodeId}`);
            this.update(nodeId, destination, ChoiceFor.LAYOUT);
        };
        return x;
    }
    /**
     * Create or update rows for the given node. Called after the data has been changed and needs to be reflected in the ui
     * @param nodeId
     */
    update(nodeId, destination, choiceFor) {
        // Clear all rows from the body
        destination.innerHTML = ``;
        const node = this.data.nodes.get(nodeId);
        const choices = node.choices;
        choices.forEach(choice => {
            let element;
            if (choiceFor === ChoiceFor.LAYOUT) {
                element = this.choiceForLayout(nodeId, choice);
            }
            else {
                element = this.choiceForEditor(nodeId, choice);
            }
            destination.appendChild(element);
        });
        this.data.dump();
    }
    changeNode(nodeId) {
        // Update the header
        const text = this.data.nodes.get(nodeId).text;
        const header = document.getElementById(`node-editor-header`);
        header.getElementsByTagName("textarea").item(0).value = text;
        // Update the responses
        const destination = document.getElementById(`node-editor-body`);
        this.update(nodeId, destination, ChoiceFor.EDITOR);
        // Show the node
        document.getElementById("node-editor").style.display = "block";
        this.currentNode.setCurrentNode(nodeId);
    }
}
//# sourceMappingURL=ChoiceMaker.js.map