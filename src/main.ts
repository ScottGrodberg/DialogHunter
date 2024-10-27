import { Connector } from "./Connector.js";
import { Data } from "./Data.js";
import { Interchange } from "./Interchange.js";
import { Utility } from "./Utility.js";

const svgns = "http://www.w3.org/2000/svg";

window.addEventListener("DOMContentLoaded", () => {
    const main = new Main();
    main.setup();
});

export class Main {

    setup() {
        const data = new Data();
        const utility = new Utility();

        // Layout wrapper
        const divWrapper = document.createElement("div");
        divWrapper.id = "divWrapper";
        divWrapper.style.height = "50%";
        divWrapper.style.overflow = "scroll";
        document.body.appendChild(divWrapper);

        // Layout inner
        const div = document.createElement("div");
        div.style.width = "2000px";
        div.style.height = "1000px";
        div.style.position = "relative";

        // Svg
        const svg = document.createElementNS(svgns, "svg");
        svg.id = "svg-layout";
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        div.appendChild(svg);

        const connector = new Connector(data, div, svg);

        // Add new interchange button
        const buttonNew = document.createElement("button");
        buttonNew.innerHTML = "+";
        buttonNew.style.position = "fixed";
        buttonNew.style.zIndex = "1";
        buttonNew.style.top = "0";
        buttonNew.style.left = "0";
        buttonNew.onclick = () => this.addInterchange(connector, utility, data, divWrapper, div);
        div.appendChild(buttonNew);

        // Start with one interchange
        const firstInterchange = this.addInterchange(connector, utility, data, divWrapper, div);
        firstInterchange.element.style.top = "66px";
        firstInterchange.element.style.left = "100px";

        // Final composition
        divWrapper.appendChild(div);
        document.body.appendChild(divWrapper);

    }

    addInterchange(connector: Connector, utility: Utility, data: Data, divWrapper: HTMLDivElement, div: HTMLDivElement): Interchange {

        const interchange = new Interchange(connector, utility, data);

        // Add to ui
        const left = divWrapper.scrollLeft + divWrapper.offsetWidth * 0.5 + Math.random() * 100 - 50 - Interchange.DEFAULT_WIDTH * 0.5;
        const top = divWrapper.scrollTop + divWrapper.offsetHeight * 0.5 + Math.random() * 100 - 50 - Interchange.DEFAULT_WIDTH * 0.5;
        interchange.element.style.left = left + "px";
        interchange.element.style.top = top + "px";
        div.appendChild(interchange.element);

        // Add to data
        if (data.incoming.has(interchange.id) || data.outgoing.has(interchange.id)) {
            throw new Error(`Unexpected duplicate nodeId`);
        }
        data.incoming.set(interchange.id, new Set<string>());
        data.outgoing.set(interchange.id, new Set<string>());

        return interchange;
    }
}