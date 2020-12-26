import EntityBase from 'utils/entities/base';

const updateEntity = async <TEntityType extends typeof EntityBase>(type: TEntityType, entityId: string, entityData: any) => {
  const entity = await type.getRepository().findSingle(entityId);

  entity.merge(entityData);

  return type.getRepository().save(entity);
};

export default updateEntity;
