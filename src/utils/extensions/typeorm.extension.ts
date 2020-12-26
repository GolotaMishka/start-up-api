import { BaseEntity, Connection, EntityManager, FindOneOptions, getConnection, ObjectType, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import ExpressContext from 'utils/expressContext';

import NotFound from '../responses/errors/notFound';

Connection.prototype.createEntityManager = function (queryRunner?: QueryRunner): EntityManager {
  const em = ExpressContext.get('entityManager');
  if (em) {
    return em;
  }
  return new EntityManager(this, queryRunner);
};

BaseEntity.getRepository = function <T>(this: ObjectType<T>): Repository<T> {
  const connection = getConnection();
  const em = connection.createEntityManager();
  return em.getRepository(this);
};

// Repository.prototype.findSingle = async function <Entity>(idOrConditions?: any, options?: FindOneOptions<Entity>): Promise<Entity> {
//   try {
//     return await this.findOneOrFail(idOrConditions, options);
//   } catch (error) {
//     if (error.name === 'EntityNotFound') {
//       throw new NotFound(error.message, `${this.target.name}${NotFound.name}`);
//     }
//     throw error;
//   }
// };

// SelectQueryBuilder.prototype.joinTranslatable = function <TEntity>(property: string, alias: string, language = defaultLang, defaultLanguage = defaultLang): SelectQueryBuilder<TEntity> {
//   const self = this as SelectQueryBuilder<TEntity>;
//   const sortAlias = `${alias.toLowerCase()}_has_language`;
//   return self
//     .leftJoinAndSelect(property, `${alias}TransKey`)
//     .leftJoinAndSelect(`${alias}TransKey.translatables`, alias, `${alias}.language = :language OR ${alias}.language = :defaultLanguage`)
//     .addSelect('(translatable.language = :language)', sortAlias)
//     .addOrderBy(sortAlias, 'DESC')
//     .setParameters({ language, defaultLanguage });
// };
