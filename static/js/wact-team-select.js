const wactTeamSelect = document.createElement("template");
wactTeamSelect.innerHTML = `
    <style>
        #team-select__header-wrapper {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 1%;
            margin-bottom: 1%;
        }

        #team-select__name-input-label {
            width: 100%;
            font-weight: bold;
            font-size: 2em;
        }

        #team-select__name-input {
            width: 100%;
            background-color: rgba(0, 0, 0, 0);
            border-style: solid;
            border-width: 0 0 3px 0;
            transition: all 200ms ease-in-out;
            border-color: black;
            font-size: 1.5em;
        }

        #team-select__name-input:focus, #team-select__name-input:hover {
            border-color: royalblue;
        }

        #team-select__image-wrapper {
            position: relative;
            height: 40vh;
            background-color: rgba(0, 0, 0, 0.7);
            transition: all 100ms ease-in-out;
        }

        #team-select__image-wrapper:hover {
            background-color: rgba(0, 0, 0, 0.2);
        }

        #team-select__logo {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            z-index: -1;
        }

        #team-select__logo-url-input-wrapper {
            width: 100%;
            position: absolute;
            z-index: 1;
            left: 0;
            bottom: 0;
            display: flex;
            justify-content: space-between;
        }

        #team-select__logo-url-input {
            width: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            border-style: solid;
            border-color: gray;
            border-width: 0 0 3px 0;
            transition: all 200ms ease-in-out;
            color: white;
            margin-left: 1%;
            font-size: 1.25em;
        }

        #team-select__logo-url-input:focus, #team-select__logo-url-input:hover {
            border-color: royalblue;
        }

        #team-select__logo-url-input-label {
            color: white;
            font-size: 1.25em;
            margin-left: 1%;
        }

        #team-select__offense-wrapper {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 1%;
            margin-bottom: 1%;
        }

        #team-select__offense-input-label {
            font-size: 1.5em;
        }

        #team-select__offense-input {
            background-color: rgba(0, 0, 0, 0);
            border-style: solid;
            border-width: 0 0 3px 0;
            transition: all 200ms ease-in-out;
            border-color: black;
            font-size: 1.5em;
        }

        #team-select__offense-input:focus, #team-select__offense-input:hover {
            border-color: royalblue;
        }

        #team-select__defense-wrapper {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 1%;
            margin-bottom: 1%;
        }

        #team-select__defense-input-label {
            font-size: 1.5em;
        }

        #team-select__defense-input {
            background-color: rgba(0, 0, 0, 0);
            border-style: solid;
            border-width: 0 0 3px 0;
            transition: all 200ms ease-in-out;
            border-color: black;
            font-size: 1.5em;
        }

        #team-select__defense-input:focus, #team-select__defense-input:hover {
            border-color: royalblue;
        }
    </style>
    <div id="team-select__wrapper" class="team-select__wrapper">
        <div id="team-select__header-wrapper" class="team-select__header-wrapper">
            <label id="team-select__name-input-label" class="team-select__name-input-label">Home</label>
            <input id="team-select__name-input" class="team-select__name-input" type="text" value="Home Team">
        </div>
        <div id="team-select__image-wrapper" class="team-select__image-wrapper">
            <img id="team-select__logo" class="team-select__logo" src="https://official-flc.com/img/default-club-picture.png">
            <div id="team-select__logo-url-input-wrapper" class="team-select__logo-url-input-wrapper">
                <label id="team-select__logo-url-input-label" class="team-select__logo-url-input-label">Url: </label>
                <input id="team-select__logo-url-input" class="team-select__logo-url-input" type="text" value="https://official-flc.com/img/default-club-picture.png">
            </div>
        </div>
        <div id="team-select__offense-wrapper" class="team-select__offense-wrapper">
            <label id="team-select__offense-input-label" class="team-select__offense-input-label">Offense</label>
            <input id="team-select__offense-input" class="team-select__offense-input" type="number" value="50" min="0" max="100">
        </div>
        <div id="team-select__defense-wrapper" class="team-select__defense-wrapper">
            <label id="team-select__defense-input-label" class="team-select__defense-input-label">Defense</label>
            <input id="team-select__defense-input" class="team-select__defense-input" type="number" value="50" min="0" max="100">
        </div>
    </div>
`;
class WACTTeamSelect extends HTMLElement {
    constructor() {
        super();

        // Instantiate the shadow root and append the template to it
        this.root = this.attachShadow({ "mode" : "open" });
        const clone = wactTeamSelect.content.cloneNode(true);
        this.root.append(clone);

        // Add event listener to refresh the image when the URL is changed
        this.imageUrlTimeout = null;
        let imageUrlInput = this.root.getElementById("team-select__logo-url-input");
        imageUrlInput.addEventListener('input', this.refreshImageUrl.bind(this));
    }

    // Define the allowed custom attributes
    static get observedAttributes() {
        return ["away"];
    }

    // Getter for away attribute
    get away() {
        return this.hasAttribute('away');
    }

    // Setter for the away attribute
    set away(value) {
        if(value) {
            this.setAttribute('away', value);
        }
        else {
            this.removeAttribute('away');
        }
    }

    // Get the team logo
    get logo() {
        return this.root.getElementById("team-select__logo").getAttribute("src");
    }

    // Get the team in JSON format
    get team() {
        const name = this.root.getElementById("team-select__name-input").value;
        const offenseOverall = parseInt(this.root.getElementById("team-select__offense-input").value);
        const defenseOverall = parseInt(this.root.getElementById("team-select__defense-input").value);
        return {
            "name": name,
            "offense_overall": offenseOverall,
            "defense_overall": defenseOverall
        }
    }

    // Update the component when the away attribute is toggled
    toggleAway() {
        // Construct the header text for the component
        let homeAwayText = "Home";
        if(this.away) {
            homeAwayText = "Away";
        }

        // Update the header text
        let header = this.root.getElementById("team-select__name-input-label");
        header.innerHTML = homeAwayText;

        // Update the default team name
        let nameInput = this.root.getElementById("team-select__name-input");
        nameInput.value = `${homeAwayText} Team`;
    }

    // Refresh the image when the URL is changed
    refreshImageUrl() {
        clearTimeout(this.imageUrlTimeout);
        this.imageUrlTimeout = setTimeout(function(){
            let imageDisplay = this.root.getElementById("team-select__logo");
            const imageInput = this.root.getElementById("team-select__logo-url-input");
            const imageUrl = imageInput.value;
            imageDisplay.setAttribute('src', imageUrl);
        }.bind(this), 1000);
    }

    //Handle values and changes to the attributes
    attributeChangedCallback(attribute, previousValue, newValue) {
        if (attribute.toLowerCase() === "away") {
            this.toggleAway();
        }
    }
}
window.customElements.define("wact-team-select", WACTTeamSelect);