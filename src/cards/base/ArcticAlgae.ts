import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {ISpace} from '../../boards/ISpace';
import {TileType} from '../../TileType';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class ArcticAlgae extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ARCTIC_ALGAE,
      tags: [Tags.PLANT],
      cost: 12,

      metadata: {
        description: 'It must be -12 C or colder to play. Gain 1 plant.',
        cardNumber: '023',
        requirements: CardRequirements.builder((b) => b.temperature(-12).max()),
        renderData: CardRenderer.builder((b) => {
          b.effectBox((be) => be.oceans(1).any.startEffect.plants(2).description('Effect: When anyone places an ocean tile, gain 2 plants.')).br;
          b.plants(1);
        }),
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    return game.checkMaxRequirements(player, GlobalParameter.TEMPERATURE, -12);
  }
  public onTilePlaced(player: Player, space: ISpace) {
    if (space.tile !== undefined && space.tile.tileType === TileType.OCEAN) {
      player.plants += 2;
    }
  }
  public play(player: Player) {
    player.plants++;
    return undefined;
  }
}
