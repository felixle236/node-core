import { USER_SCHEMA } from './UserSchema';

export const MANAGER_SCHEMA = {
  TABLE_NAME: 'manager',
  COLUMNS: {
    ...USER_SCHEMA.COLUMNS,
    EMAIL: 'email',
    STATUS: 'status',
    ARCHIVED_AT: 'archived_at',
  },
  RELATED_ONE: {
    // The field name that we're defined into entity to map the entity related.
  },
  RELATED_MANY: {
    // The field name that we're defined into entity to map the entity related.
  },
};
