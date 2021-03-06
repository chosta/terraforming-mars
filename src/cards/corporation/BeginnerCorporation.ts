
import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class BeginnerCorporation extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.BEGINNER_CORPORATION,

      metadata: {
        cardNumber: 'R00',
        description: 'You start with 42 MC. Instead of choosing from 10 cards during setup, you get 10 cards for free.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(42).nbsp.cards(10).digit;
        }),
      },
      startingMegaCredits: 42,
    });
  }
  public play(player: Player, game: Game) {
    for (let i = 0; i < 10; i++) {
      player.cardsInHand.push(game.dealer.dealCard());
    }
    return undefined;
  }
}
