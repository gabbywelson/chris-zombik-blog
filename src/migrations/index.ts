import * as migration_20251107_183848_initial from './20251107_183848_initial';
import * as migration_20251130_205458_add_short_stories from './20251130_205458_add_short_stories';

export const migrations = [
  {
    up: migration_20251107_183848_initial.up,
    down: migration_20251107_183848_initial.down,
    name: '20251107_183848_initial',
  },
  {
    up: migration_20251130_205458_add_short_stories.up,
    down: migration_20251130_205458_add_short_stories.down,
    name: '20251130_205458_add_short_stories'
  },
];
