import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Solarnet implements IProjectCard {
    public cost = 7;
    public tags = [];
    public name = CardName.SOLARNET;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
      return player.checkMultipleTagPresence([Tags.VENUS, Tags.EARTH, Tags.JOVIAN]);
    }
    public play(player: Player, game: Game) {
      player.drawCard(game, 2);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '245',
      requirements: CardRequirements.builder((b) => b.unity()),
      renderData: CardRenderer.builder((b) => {
        b.cards(2);
      }),
      description: 'Requires Venus, Earth and Jovian tags. Draw 2 cards.',
      victoryPoints: 1,
    }
}
