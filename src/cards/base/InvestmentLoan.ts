import {Tags} from '../Tags';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class InvestmentLoan extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.INVESTMENT_LOAN,
      tags: [Tags.EARTH],
      cost: 3,
      hasRequirements: false,

      metadata: {
        cardNumber: '110',
        renderData: CardRenderer.builder((b) => {
          b.productionBox((pb) => pb.megacredits(-1)).nbsp.megacredits(10);
        }),
        description: 'Decrease your MC production 1 step. Gain 10 MC.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.MEGACREDITS) >= -4;
  }
  public play(player: Player, _game: Game) {
    player.addProduction(Resources.MEGACREDITS, -1);
    player.megaCredits += 10;
    return undefined;
  }
}
