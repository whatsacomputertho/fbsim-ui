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
    </style>
    <div id="game-sim__wrapper" class="game-sim__wrapper">
        <wact-matchup-select></wact-matchup-select>
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

        // Instantiate the shadow root and append the template to it
        this.root = this.attachShadow({ "mode" : "open" });
        var clone = wactGameSimTemplate.content.cloneNode(true);
        this.root.append(clone);

        // Add event listener to simulate button to sim and show result
        let simButton = this.root.getElementById("game-sim__sim-button");
        simButton.addEventListener("click", this.simulateGame.bind(this));
    }

    // Define the allowed custom attributes
    static get observedAttributes()
    {
        return [];
    }

    // Simulate the game and show the result
    simulateGame() {
        // Show the result
        let resultWrapper = this.root.getElementById("game-sim__result-wrapper");
        resultWrapper.style.display = "block";
    }
}
window.customElements.define("wact-game-sim", WACTGameSim);