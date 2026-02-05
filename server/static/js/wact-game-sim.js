const wactGameSimTemplate = document.createElement("template");
wactGameSimTemplate.innerHTML = `
    <style>
        #game-sim__sim-button-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #game-sim__sim-button {
            margin-top: 1%;
            width: 50%;
            font-size: 1.5rem;
            color: yellow;
            background-color: #162267;
            border-radius: 8px;
            transition: all 100ms ease-in-out;
        }

        #game-sim__sim-button:hover {
            background-color:rgb(44, 63, 170);
            cursor: pointer;
        }

        #game-sim__sim-button:active {
            background-color:rgb(71, 95, 231);
        }

        #game-sim__result-wrapper {
            display: none;
            margin-top: 1%;
        }

        #game-sim__wrapper {
            margin-bottom: 3%;
        }
    </style>
    <div id="game-sim__wrapper" class="game-sim__wrapper">
        <wact-matchup-select id="game-sim__select" class="game-sim__select"></wact-matchup-select>
        <div id="game-sim__sim-button-wrapper" class="game-sim__sim-button-wrapper">
            <button id="game-sim__sim-button" class="game-sim__sim-button">Simulate</button>
        </div>
        <div id="game-sim__result-wrapper" class="game-sim__result-wrapper">
            <wact-box-score id="game-sim__result" class="game-sim__result"></wact-box-score>
        </div>
    </div>
`;
class WACTGameSim extends HTMLElement {
    constructor() {
        super();

        // Set default sim service host
        this.simServiceHost = "http://localhost:8080";

        // Instantiate the shadow root and append the template to it
        this.root = this.attachShadow({ "mode" : "open" });
        var clone = wactGameSimTemplate.content.cloneNode(true);
        this.root.append(clone);

        // Add event listener to simulate button to sim and show result
        let simButton = this.root.getElementById("game-sim__sim-button");
        simButton.addEventListener("click", this.getBoxScore.bind(this));
    }

    // Define the allowed custom attributes
    static get observedAttributes()
    {
        return ["sim-service-host"];
    }

    // Getter for sim-service-host attribute
    get homeTeam() {
        return this.simServiceHost;
    }

    // Setter for the home-team attribute
    set homeTeam(value) {
        this.simServiceHost = value;
    }

    // Fetch the box score from the API
    getBoxScore() {
        let _self = this;
        let request = new XMLHttpRequest();
        request.onload = function(){
            const result = JSON.parse(this.responseText);
            _self.displayBoxScore(result);
        }

        // Stringify the request body and send the request
        const matchup = this.root.getElementById("game-sim__select").matchup;
        const requestBody = JSON.stringify(matchup);
        const requestUrl = this.simServiceHost + "/game/sim";
        request.open("POST", requestUrl, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(requestBody);
    }

    // Display the box score on the UI
    displayBoxScore(result) {
        // Hide the result
        let resultWrapper = this.root.getElementById("game-sim__result-wrapper");
        resultWrapper.style.display = "none";

        // Set the result properties
        const homeLogo = this.root.getElementById("game-sim__select").homeLogo;
        const awayLogo = this.root.getElementById("game-sim__select").awayLogo;
        let boxScore = this.root.getElementById("game-sim__result");
        boxScore.setAttribute("home-team", result.home_team);
        boxScore.setAttribute("away-team", result.away_team);
        boxScore.setAttribute("home-score", result.home_score);
        boxScore.setAttribute("away-score", result.away_score);
        boxScore.setAttribute("home-logo", homeLogo);
        boxScore.setAttribute("away-logo", awayLogo);

        // Show the result
        resultWrapper.style.display = "block";
    }

    // Handle changes to observed attributes
    attributeChangedCallback(attribute, previousValue, newValue) {
        if (attribute === "sim-service-host") {
            this.simServiceHost = newValue;
        }
    }
}
window.customElements.define("wact-game-sim", WACTGameSim);