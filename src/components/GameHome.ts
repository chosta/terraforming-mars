import Vue from "vue";

export const GameHome = Vue.component("game-home", {
    props: ["game"],
    data: function () {
        return {};
    },
    methods: {
        getHref: function (type: string, id: number): string {
            return `/${type}?id=${id}`;
        },
    },
    template: `
        <div id="game-home">
            <h1><span v-i18n>Terraforming Mars</span> — <span v-i18n>Game Home</span></h1>
            <p v-i18n>Send players their links below. As game administrator pick your link to use.</p>
            <ul>
                <li v-for="player in game.players">
                    <span class="player_home_block nofloat">
                        <span class="player_name" :class="'player_bg_color_'+ player.color"><a :href="getHref('player', player.id)">{{ player.name }}</a></span><span class="player-spectator"><a :href="getHref('spectate', player.id)">spectate</a></span>
                    </span>
                </li>
            </span>
            </ul>
        </div>
    `,
});
