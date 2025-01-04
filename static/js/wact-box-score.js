const wactBoxScoreTemplate = document.createElement("template");
wactBoxScoreTemplate.innerHTML = `
    <style>
        #box-score__wrapper {
            display: flex;
        }

        #box-score__home-wrapper, #box-score__away-wrapper {
            position: relative;
            width: 100%;
            height: 20vh;
            background-color: rgba(0, 0, 0, 0.7);
        }

        #box-score__home-logo, #box-score__away-logo {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            z-index: -1;
        }

        #box-score__home-score-wrapper, #box-score__away-score-wrapper {
            display: flex;
            justify-content: space-between;
        }

        #box-score__home-score-wrapper, #box-score__away-score-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            border-style: solid;
            border-color: gray;
            box-sizing: border-box;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
        }

        #box-score__home-score-wrapper {
            border-width: 0 0 0 16px;
        }

        #box-score__away-score-wrapper {
            border-width: 0 16px 0 0;
        }

        #box-score__home-team, #box-score__away-team {
            color: white;
            font-size: 2em;
            margin: 0;
            margin-left: 5%;
            margin-right: 5%;
        }

        #box-score__home-score, #box-score__away-score {
            color: white;
            font-size: 2em;
            margin: 0;
            margin-left: 5%;
            margin-right: 5%;
        }
    </style>
    <div id="box-score__wrapper" class="box-score__wrapper">
        <div id="box-score__home-wrapper" class="box-score__home-wrapper">
            <img id="box-score__home-logo" class="box-score__home-logo" src="https://official-flc.com/img/default-club-picture.png">
            <div id="box-score__home-score-wrapper" class="box-score__home-score-wrapper">
                <p id="box-score__home-team" class="box-score__home-team">Home Team</p>
                <p id="box-score__home-score" class="box-score__home-score">0</p>
            </div>
        </div>
        <div id="box-score__away-wrapper" class="box-score__away-wrapper">
            <img id="box-score__away-logo" class="box-score__away-logo" src="https://official-flc.com/img/default-club-picture.png">
            <div id="box-score__away-score-wrapper" class="box-score__away-score-wrapper">
                <p id="box-score__away-team" class="box-score__away-team">Away Team</p>
                <p id="box-score__away-score" class="box-score__away-score">0</p>
            </div>
        </div>
    </div>
`;
class WACTBoxScore extends HTMLElement {
    constructor() {
        super();

        // Instantiate the shadow root and append the template to it
        this.root = this.attachShadow({ "mode" : "open" });
        var clone = wactBoxScoreTemplate.content.cloneNode(true);
        this.root.append(clone);

        // Add timeouts to the box score class for image updates
        this.homeLogoTimeout = null;
        this.awayLogoTimeout = null;
    }

    //Define the allowed custom attributes
    static get observedAttributes()
    {
        return [
            "home-team", "home-logo", "home-score",
            "away-team", "away-logo", "away-score"
        ];
    }

    // Getter for home-team attribute
    get homeTeam() {
        return this.getAttribute("home-team");
    }

    // Setter for the home-team attribute
    set homeTeam(value) {
        this.setAttribute("home-team", value);
    }

    // Getter for home-logo attribute
    get homeLogo() {
        return this.getAttribute("home-logo");
    }

    // Setter for the home-logo attribute
    set homeLogo(value) {
        this.setAttribute("home-logo", value);
    }

    // Getter for home-score attribute
    get homeScore() {
        return this.getAttribute("home-score");
    }

    // Setter for the home-score attribute
    set homeScore(value) {
        this.setAttribute("home-score", value);
    }

    // Getter for away-team attribute
    get awayTeam() {
        return this.getAttribute("away-team");
    }

    // Setter for the away-team attribute
    set awayTeam(value) {
        this.setAttribute("away-team", value);
    }

    // Getter for away-logo attribute
    get awayLogo() {
        return this.getAttribute("away-logo");
    }

    // Setter for the away-logo attribute
    set awayLogo(value) {
        this.setAttribute("away-logo", value);
    }

    // Getter for away-score attribute
    get awayScore() {
        return this.getAttribute("away-score");
    }

    // Setter for the away-score attribute
    set awayScore(value) {
        this.setAttribute("away-score", value);
    }

    // Recalculate the winner when the score is changed
    calculateWinner() {
        // Get the current home and away score
        const homeScore = parseInt(
            this.root.getElementById("box-score__home-score").innerHTML
        );
        const awayScore = parseInt(
            this.root.getElementById("box-score__away-score").innerHTML
        );

        // Compare and update score wrapper border & wrapper background
        let homeWrapper = this.root.getElementById("box-score__home-wrapper");
        let homeScoreWrapper = this.root.getElementById("box-score__home-score-wrapper");
        let awayWrapper = this.root.getElementById("box-score__away-wrapper");
        let awayScoreWrapper = this.root.getElementById("box-score__away-score-wrapper");
        if (homeScore > awayScore) {
            homeWrapper.style.backgroundColor = "rgba(0, 63, 0, 0.7)";
            homeScoreWrapper.style.borderColor = "lime";
            awayWrapper.style.backgroundColor = "rgba(63, 0, 0, 0.7)";
            awayScoreWrapper.style.borderColor = "red";
        } else if (awayScore > homeScore) {
            homeWrapper.style.backgroundColor = "rgba(63, 0, 0, 0.7)";
            homeScoreWrapper.style.borderColor = "red";
            awayWrapper.style.backgroundColor = "rgba(0, 63, 0, 0.7)";
            awayScoreWrapper.style.borderColor = "lime";
        } else {
            homeWrapper.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            homeScoreWrapper.style.borderColor = "gray";
            awayWrapper.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            awayScoreWrapper.style.borderColor = "gray";
        }
    }

    // Handle changes to observed attributes
    attributeChangedCallback(attribute, previousValue, newValue) {
        if (attribute.toLowerCase() === "home-team") {
            this.root.getElementById("box-score__home-team").innerHTML = newValue;
        }
        if (attribute.toLowerCase() === "home-logo") {
            this.root.getElementById("box-score__home-logo").setAttribute("src", newValue);
        }
        if (attribute.toLowerCase() === "home-score") {
            this.root.getElementById("box-score__home-score").innerHTML = parseInt(newValue);
            this.calculateWinner();
        }
        if (attribute.toLowerCase() === "away-team") {
            this.root.getElementById("box-score__away-team").innerHTML = newValue;
        }
        if (attribute.toLowerCase() === "away-logo") {
            this.root.getElementById("box-score__away-logo").setAttribute("src", newValue);
        }
        if (attribute.toLowerCase() === "away-score") {
            this.root.getElementById("box-score__away-score").innerHTML = parseInt(newValue);
            this.calculateWinner();
        }
    }
}
window.customElements.define("wact-box-score", WACTBoxScore);