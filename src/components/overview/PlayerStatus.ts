import Vue from "vue";
import { ActionLabel } from "./ActionLabel";
import { PlayerModel } from "../../models/PlayerModel";

const isPinned = (root: any, player: PlayerModel): boolean => {
    return (root as any).getVisibilityState("pinned_player_" + player.id);
};
const showPlayerData = (root: any, player: PlayerModel) => {
    (root as any).setVisibilityState("pinned_player_" + player.id, true);
    (root as any).setVisibilityState("other_player_" + player.id, true);
};
export const hidePlayerData = (root: any, player: PlayerModel) => {
    (root as any).setVisibilityState("pinned_player_" + player.id, false);
    (root as any).setVisibilityState("other_player_" + player.id, false);
};

export const PlayerStatus = Vue.component("player-status", {
    props: ["player", "activePlayer", "firstForGen", "actionLabel"],
    methods: {
        showPlayerDetails: function () {
            // for active player => scroll to cards UI
            if (this.player.id === this.activePlayer.id) {
                let el: HTMLElement = document.getElementsByClassName(
                    "preferences_icon--cards"
                )[0] as HTMLElement;
                el.click();

                return;
            }
            // any other player show cards container and hide all other
            this.pinPlayer();
        },
        showLabel: function (): boolean {
            return this.actionLabel !== ActionLabel.NONE;
        },
        getLabelClasses: function (): string {
            let classes = [];
            const baseClass = "player-action-status";
            classes.push(baseClass);
            if (this.actionLabel === ActionLabel.PASSED) {
                classes.push(`${baseClass}--passed`);
            } else if (this.actionLabel === ActionLabel.ACTIVE) {
                classes.push(`${baseClass}--active`);
            }
            return classes.join(" ");
        },
        getPlayerNameClasses: function (): string {
            let classes = [];
            const baseClass = "player-name";
            classes.push(baseClass);
            if (this.player.id === this.activePlayer.id) {
                classes.push(`${baseClass}--inactive`);
            }
            return classes.join(" ");
        },
        getNrPlayedCards: function (): number {
            return this.player.playedCards.length;
        },
        pinPlayer: function () {
            const player = this.player;
            const players = this.activePlayer.players;

            let hiddenPlayers: Array<PlayerModel> = [];
            let playerPinned = isPinned(this.$root, player);

            // if player is already pinned, on unpin add to hidden players
            if (playerPinned) {
                hiddenPlayers = players;
            } else {
                showPlayerData(this.$root, player);

                for (i = 0; i < players.length; i++) {
                    let p = players[i];
                    if (p.id === this.activePlayer.id || player.id !== p.id) {
                        hiddenPlayers.push(p);
                    }
                }
            }

            for (var i = 0; i < hiddenPlayers.length; i++) {
                hidePlayerData(this.$root, hiddenPlayers[i]);
            }
        },
    },
    mounted: function () {
        //console.log(this.player, "player");
        //console.log(this.activePlayer, "active player id");
    },
    template: `
        <div class="player-status">
            <div class="player-status-left">
                <div class="top-row">
                    <div class="player-view-status" />
                    <div :class="getPlayerNameClasses()" v-on:click.prevent="showPlayerDetails()" >{{ player.name }}</div>
                    <div class="icon-first-player-offset icon-first-player" v-if="firstForGen">1st</div>
                </div>
                <div class="player-corp">{{ player.corporationCard.name }}</div>
                <div v-if="showLabel()" :class="getLabelClasses()">{{ actionLabel }}</div>
            </div>
            <div class="player-status-right">
                <div class="icons-and-count">
                    <div class="played-cards-icons">
                        <div class="played-cards-arrow" />
                        <div class="played-cards-icon" />
                    </div>
                    <div class="played-cards-count">{{ getNrPlayedCards() }}</div>
                </div>
                <button class="played-cards-show btn" v-on:click.prevent="showPlayerDetails()">show</button>
            </div>
        </div>
    `,
});
