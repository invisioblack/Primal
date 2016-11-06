export interface BaseCreep extends Array<CreepBodyPart> {
}

interface BodyOpts {
  travel?: TravelCondition;
  maxCarry?: number;
  maxMove?: number;
  maxWork?: number;
}

export class BodyBuilder {
	private static partCost(p: CreepBodyPart) {
		return BODYPART_COST[p];
	}

  public static bodyCost(body: CreepBodyPart[]) {
    let cost = 0;
    for (let i = 0; i < body.length; ++i) {
      cost = cost + this.partCost(body[i]);
    }
    return cost;
  }

  public static fatiguePerMove(body: CreepBodyPart[], travelCondition: TravelCondition) {
    //TODO: account for boosts
    let terrainFactor: number;
    switch (travelCondition) {
      case TravelCondition.road:
        terrainFactor = 1;
        break;
      case TravelCondition.plain:
        terrainFactor = 2;
        break;
      case TravelCondition.swamp:
        terrainFactor = 10;
        break;
      default:
        throw new Error("Invalid terrain condition");
    }
    const moveCount = body.count(MOVE);
    return (body.length - moveCount) * terrainFactor - moveCount * 2;
  }

  public static readonly MaxParts = 50;

  public static buildCreepBody(
    maxCost: number,
    base: CreepBodyPart[],
    grow: CreepBodyPart[],
    opts: BodyOpts = {}
  ): CreepBodyPart[] | undefined {
    const baseCost = this.bodyCost(base);
    const travelCondition = opts.travel !== undefined ? opts.travel : TravelCondition.road;
    const max: { [partName: string]: number; move: number; carry: number; work: number; } = {
      move: opts.maxMove || this.MaxParts,
      carry: opts.maxCarry || this.MaxParts,
      work: opts.maxWork || this.MaxParts,
    };
    const growBuffer = grow.slice();

    let lastValid: Array<CreepBodyPart> | undefined = undefined;
    let curBody = base.slice();
    grower:
    while (true) {
      const fatiguePerMove = this.fatiguePerMove(curBody, travelCondition);
      const curCost = this.bodyCost(curBody);
      const moveCount = curBody.count(MOVE);
      if (fatiguePerMove > 0 && moveCount < max.move) {
        //insufficient moves to meet body count
        const costWithMove = curCost + BODYPART_COST[MOVE];
        if (costWithMove > maxCost) {
          break grower;//Can't afford more, return the last that worked, or undefined if none worked at all
        }
        curBody.push(MOVE);
        continue grower;
      } else {
        lastValid = curBody.slice();
      }

      //bypass non-move growth if there's nothing to grow
      if (growBuffer.length > 0 && ((fatiguePerMove === 0 && moveCount < max.move ? curBody.length + 1 : curBody.length) < this.MaxParts)) {
        const remainingAlloc = maxCost - curCost - (fatiguePerMove === 0 && moveCount < max.move ? BODYPART_COST[MOVE] : 0);//Needs an additional MOVE
        let affordablePart: string | undefined = undefined;
        for (let part of growBuffer) {
          if (BODYPART_COST[part] > remainingAlloc || curBody.count(part) >= max[part]) { continue; }
          affordablePart = part;
          break;
        }
        if (affordablePart === undefined) {
          break grower;//Cannot afford to grow any further
        }
        //If we must add a MOVE part to grow the new non-move part
        if (fatiguePerMove === 0 && moveCount < max.move) {
          curBody.push(MOVE);
        }
        growBuffer.unshift(<CreepBodyPart>growBuffer.pop());
        curBody.push(affordablePart);
        continue grower;//Further movement scheduling
      }
      break grower;
    }

    return lastValid !== undefined ? this.sortParts(lastValid) : undefined;
  }

  private static sortParts(body: Array<CreepBodyPart>): Array<CreepBodyPart> {
    return body;//TODO: Implement, then add tests
  }
}
