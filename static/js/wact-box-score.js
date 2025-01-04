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
    }

    //Define the allowed custom attributes
    static get observedAttributes()
    {
        return [];
    }
}
window.customElements.define("wact-box-score", WACTBoxScore);