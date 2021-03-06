import {IProjectCard} from '../IProjectCard';
import {IActionCard, ICard, IResourceCard} from '../ICard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {ResourceType} from '../../ResourceType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {LogHelper} from '../../LogHelper';
import {SelectCard} from '../../inputs/SelectCard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class AsteroidRights implements IActionCard, IProjectCard, IResourceCard {
  public name = CardName.ASTEROID_RIGHTS;
  public cost = 10;
  public tags = [Tags.EARTH, Tags.SPACE];
  public resourceType = ResourceType.ASTEROID;
  public resourceCount: number = 0;
  public cardType = CardType.ACTIVE;

  public play() {
    this.resourceCount = 2;
    return undefined;
  }

  public canAct(player: Player): boolean {
    return player.canAfford(1) || this.resourceCount > 0;
  }

  public action(player: Player, game: Game) {
    const canAddAsteroid = player.canAfford(1);
    const hasAsteroids = this.resourceCount > 0;
    const asteroidCards = player.getResourceCards(ResourceType.ASTEROID);

    const spendAsteroidOption = new SelectOption('Remove 1 asteroid on this card to increase MC production 1 step OR gain 2 titanium', 'Remove asteroid', () => {
      this.resourceCount--;

      return new OrOptions(
        new SelectOption('Increase MC production 1 step', 'Select', () => {
          player.addProduction(Resources.MEGACREDITS);
          LogHelper.logRemoveResource(game, player, this, 1, 'increase MC production 1 step');
          return undefined;
        }),
        new SelectOption('Gain 2 titanium', 'Select', () => {
          player.titanium += 2;
          LogHelper.logRemoveResource(game, player, this, 1, 'gain 2 titanium');
          return undefined;
        }),
      );
    });

    const addAsteroidToSelf = new SelectOption('Add 1 asteroid to this card', 'Add asteroid', () => {
      game.defer(new SelectHowToPayDeferred(player, 1, false, false, 'Select how to pay for asteroid'));
      player.addResourceTo(this);
      LogHelper.logAddResource(game, player, this);

      return undefined;
    });

    const addAsteroidOption = new SelectCard('Select card to add 1 asteroid', 'Add asteroid', asteroidCards, (foundCards: Array<ICard>) => {
      game.defer(new SelectHowToPayDeferred(player, 1, false, false, 'Select how to pay for asteroid'));
      player.addResourceTo(foundCards[0], 1);
      LogHelper.logAddResource(game, player, foundCards[0]);

      return undefined;
    });

    // Spend asteroid
    if (!canAddAsteroid) return spendAsteroidOption.cb();

    // Add asteroid to any card
    if (!hasAsteroids) {
      if (asteroidCards.length === 1) return addAsteroidToSelf.cb();
      return addAsteroidOption;
    }

    const opts: Array<SelectOption | SelectCard<ICard>> = [];
    opts.push(spendAsteroidOption);
    asteroidCards.length === 1 ? opts.push(addAsteroidToSelf) : opts.push(addAsteroidOption);

    return new OrOptions(...opts);
  }
  public metadata: CardMetadata = {
    cardNumber: 'X31',
    description: 'Add 2 asteroids to this card.',
    renderData: CardRenderer.builder((b) => {
      b.effectBox((eb) => {
        eb.megacredits(1).startAction.asteroids(1).asterix();
        eb.description('Action: Spend 1 MC to add 1 asteroid to ANY card.');
      }).br;
      b.effectBox((eb) => {
        eb.asteroids(1)
          .startAction.productionBox((pb) => pb.megacredits(1))
          .or()
          .titanium(2);
        eb.description('Action: Spend 1 asteroid here to increase MC production 1 step OR gain 2 titanium.');
      }).br;
      b.asteroids(2);
    }),
  };
}
