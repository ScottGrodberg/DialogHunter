import { Connector } from "./Connector.js";
import { Interchange } from "./Interchange.js";

const svgns = "http://www.w3.org/2000/svg";

window.addEventListener("DOMContentLoaded", () => {
    const main = new Main();
    main.setup();
});

export class Main {

    setup() {
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
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        div.appendChild(svg);

        const connector = new Connector(div, svg);

        // Add new interchange button
        const buttonNew = document.createElement("button");
        buttonNew.innerHTML = "+";
        buttonNew.style.position = "fixed";
        buttonNew.style.zIndex = "1";
        buttonNew.onclick = () => {
            const interchange = new Interchange(connector);
            const left = divWrapper.scrollLeft + divWrapper.offsetWidth * 0.5 + Math.random() * 100 - 50 - Interchange.DEFAULT_WIDTH * 0.5;
            const top = divWrapper.scrollTop + divWrapper.offsetHeight * 0.5 + Math.random() * 100 - 50 - Interchange.DEFAULT_WIDTH * 0.5;
            interchange.element.style.left = left + "px";
            interchange.element.style.top = top + "px";
            div.appendChild(interchange.element);
        };
        div.appendChild(buttonNew);

        const interchange = new Interchange(connector)
        interchange.element.style.left = "100px";
        interchange.element.style.top = "100px";
        div.appendChild(interchange.element);

        // Final composition
        divWrapper.appendChild(div);
        document.body.appendChild(divWrapper);

    }


}