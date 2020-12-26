// When loading tests we receive errors sometimes. Including the core-js lib again here resolves that issue. Since it's already loaded in a running environment this will not cause any performance hit.
import 'core-js';

import { Type } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { IsArray, IsObject, ValidateIf, ValidateNested } from 'class-validator';

const nested = <T>(type: ClassType<T>, isArray = false, childType: ClassType<any> = undefined) => {
  const nestedValidation = ValidateNested({ each: isArray, context: childType || type });
  const typeParser = Type(() => type);
  const validateIf = ValidateIf((object, value) => value !== null);
  const validateAsObjectOrArray = isArray ? IsArray() : IsObject();

  return (object: any, propertyName: string) => {
    validateIf(object, propertyName);
    nestedValidation(object, propertyName);
    validateAsObjectOrArray(object, propertyName);
    typeParser(object, propertyName);
  };
};

export default nested;
