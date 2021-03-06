import { Model, RelationExpression } from 'objection';
import { CustomQueryBuilder } from './QueryBuilder';
import { basePath } from '../helpers';

export class BaseModel extends Model {
  readonly id: number | undefined;

  // custom query builder
  QueryBuilderType!: CustomQueryBuilder<this>;
  static QueryBuilder = CustomQueryBuilder;

  // query constraints
  static useLimitInFirst = true;
  static modulePaths = [];

  static setModulePaths(this:any,modules: string[]) {
    this.modulePaths = modules;
  }

  static get modelPaths() {
    const root = basePath();
    return BaseModel.modulePaths.map(m => `${root}dist/src/${m}/models`);
  }

  async fetchRelation(this: any, expression: RelationExpression<any>, options = {}) {
    if (this[expression.toString()]) return this;
    await this.$fetchGraph(expression, options);
    return this;
  }
}
