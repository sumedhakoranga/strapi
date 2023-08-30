import { propOr } from 'lodash/fp';
import { contentTypes } from '@strapi/utils';

import {
  getPaginationInfo,
  convertPagedToStartLimit,
  shouldCount,
  transformPaginationResponse,
} from './pagination';
import { getFetchParams } from './get-fetch-params';
import type { CoreApi, Schema } from '../../types';

const {
  hasDraftAndPublish,
  constants: { PUBLISHED_AT_ATTRIBUTE },
} = contentTypes;

const setPublishedAt = (data: Record<string, unknown>) => {
  data[PUBLISHED_AT_ATTRIBUTE] = propOr(new Date(), PUBLISHED_AT_ATTRIBUTE, data);
};

/**
 *
 * Returns a collection type service to handle default core-api actions
 */
const createCollectionTypeService = ({
  contentType,
}: {
  contentType: Schema.CollectionType;
}): CoreApi.Service.CollectionType => {
  const { uid } = contentType;

  return {
    getFetchParams,

    async find(params = {}) {
      const fetchParams = this.getFetchParams(params);

      const paginationInfo = getPaginationInfo(fetchParams);

      const results = await strapi.entityService?.findMany(uid, {
        ...fetchParams,
        ...convertPagedToStartLimit(paginationInfo),
      });

      if (shouldCount(fetchParams)) {
        const count = await strapi.entityService?.count(uid, { ...fetchParams, ...paginationInfo });

        return {
          results,
          pagination: transformPaginationResponse(paginationInfo, count),
        };
      }

      return {
        results,
        pagination: paginationInfo,
      };
    },

    findOne(entityId, params = {}) {
      return strapi.entityService?.findOne(uid, entityId, this.getFetchParams(params));
    },

    create(params = { data: {} }) {
      const { data } = params;

      if (hasDraftAndPublish(contentType)) {
        setPublishedAt(data);
      }

      return strapi.entityService?.create(uid, { ...params, data });
    },

    update(entityId, params = { data: {} }) {
      const { data } = params;

      return strapi.entityService?.update(uid, entityId, { ...params, data });
    },

    delete(entityId, params = {}) {
      return strapi.entityService?.delete(uid, entityId, params);
    },
  };
};

export default createCollectionTypeService;
