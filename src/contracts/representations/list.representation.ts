import { Exclude, Expose } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

import nested from '../../utils/decorators/nested';
import numeric from '../../utils/decorators/numeric';

export default class ListRepresentation<T> {
  public count: number;
  public items: T[];

  constructor(count: number, items: T[]) {
    this.count = count;
    this.items = items;
  }
}

export const createListRepresentation = <T>(type: ClassType<T>): ClassType<ListRepresentation<T>> => {
  const name = type.name.replace('Representation', ListRepresentation.name);

  @Exclude()
  class ListRepresentationFactory {
    @Expose()
    @numeric()
    public count: number;

    @Expose()
    @nested(type, true)
    public items: T[];
  }

  Object.defineProperty(ListRepresentationFactory, 'name', { value: name });

  return ListRepresentationFactory;
};
