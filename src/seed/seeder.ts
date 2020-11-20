import { formatDistanceToNow } from 'date-fns';

interface IEntities {
  readonly users: string[];
  readonly organizations: string[];
  readonly projects: string[];
  readonly tickets: string[];
}

export class Seeder {
  readonly start = new Date();

  private readonly _entities: IEntities = {
    users: [],
    organizations: [],
    projects: [],
    tickets: [],
  };

  get count() {
    let count = 0;

    for (const entity in this._entities) {
      count += this._entities[entity as keyof IEntities].length;
    }

    return count;
  }

  get elapse() {
    return formatDistanceToNow(this.start);
  }

  set(id: string, entity: keyof IEntities) {
    this._entities[entity].push(id);
  }

  get(entity: keyof IEntities) {
    return this._entities[entity][this._getRandomNumber(this._entities[entity].length)];
  }

  private _getRandomNumber(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
