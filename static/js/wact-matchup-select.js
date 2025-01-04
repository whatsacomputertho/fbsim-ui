const wactMatchupSelect = document.createElement("template");
wactMatchupSelect.innerHTML = `
    <style>
        #matchup-select__wrapper {
            display: flex;
        }

        #matchup-select__home {
            width: 100%;
            padding-right: 1%;
        }

        #matchup-select__away {
            width: 100%;
            padding-left: 1%;
        }
    </style>
    <div id="matchup-select__wrapper" class="matchup-select__wrapper">
        <wact-team-select id="matchup-select__home" class="matchup-select__home"></wact-team-select>
        <wact-team-select away id="matchup-select__away" class="matchup-select__away"></wact-team-select>
    </div>
`
class WACTMatchupSelect extends HTMLElement {
    constructor() {
        super();

        // Instantiate the shadow root and append the template to it
        this.root = this.attachShadow({ "mode" : "open" });
        const clone = wactMatchupSelect.content.cloneNode(true);
        this.root.append(clone);
    }

    // Get the home logo
    get homeLogo() {
        return this.root.getElementById("matchup-select__home").logo;
    }

    // Get the away logo
    get awayLogo() {
        return this.root.getElementById("matchup-select__away").logo;
    }

    // Get the matchup in JSON format
    get matchup() {
        const home = this.root.getElementById("matchup-select__home").team;
        const away = this.root.getElementById("matchup-select__away").team;
        return {
            "home": home,
            "away": away
        }
    }
}
window.customElements.define("wact-matchup-select", WACTMatchupSelect);