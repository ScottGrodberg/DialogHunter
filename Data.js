export class Data {
    constructor() {
        // Elements
        // Data structures, meant to be serialized to storage
        this.nodes = new Map();
        this.choices = new Map();
        // Node connections, holds DOM objects, not meant for serialization
        this.incoming = new Map(); // Connections from values to the key
        this.outgoing = new Map(); // Connections from the key to values
    }
    dump() {
        let output = "";
        output += `[`;
        this.nodes.forEach(node => {
            output += `{\n`;
            output += `  "nodeId":"${node.nodeId}",\n`;
            output += `  "text":"${node.text}",\n`;
            output += `  "choices":[\n`;
            output += `    ${node.choices.map(choiceId => JSON.stringify(this.choices.get(choiceId)))}\n`;
            output += `  ]\n`;
            output += `},\n`;
        });
        output += `]\n`;
        document.getElementById("div-output").innerHTML = output;
    }
}
//# sourceMappingURL=Data.js.map