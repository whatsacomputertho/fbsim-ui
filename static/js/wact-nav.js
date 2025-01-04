const wactNavTemplate = document.createElement("template");
wactNavTemplate.innerHTML = `
    <style>
        .navbar-wrapper {
            height: 10vh;
            background-color: #162267;
            display: flex;
            text-align: center;
            align-items: center;
            justify-content: center;
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            z-index: 1000;
        }
    </style>
    <nav id="navbar-wrapper" class="navbar-wrapper">
        <img src="/img/wactlogo.jpg" height=50%>
    </nav>
`;
class WACTNav extends HTMLElement {
    constructor() {
        super();

        // Instantiate the shadow root and append the template to it
        this.root = this.attachShadow({ "mode" : "open" });
        var clone = wactNavTemplate.content.cloneNode(true);
        this.root.append(clone);
    }

    //Define the allowed custom attributes
    static get observedAttributes()
    {
        return [];
    }
}
window.customElements.define("wact-nav", WACTNav);