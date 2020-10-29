import { expect } from "chai";
import { MartianSurvey } from "../../../src/cards/prelude/MartianSurvey";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";

describe("MartianSurvey", function () {
    let card : MartianSurvey, player : Player, game : Game;

    beforeEach(function() {
        card = new MartianSurvey();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player], player);
    });

    it("Can't play", function () {
        (game as any).oxygenLevel = 5;
        expect(card.canPlay(player, game)).is.not.true;
    });

    it("Should play", function () {
        expect(card.canPlay(player, game)).is.true;
        card.play(player, game);
        expect(game.deferredActions.length).to.eq(1);

        // Draw cards
        game.runDeferredAction(game.deferredActions[0], () => {});

        expect(card.getVictoryPoints()).to.eq(1);
        expect(player.cardsInHand.length).to.eq(2);
    });
});
