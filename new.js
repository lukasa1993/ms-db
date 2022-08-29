#!/usr/bin/env node

import metalogger          from 'metalogger';
import { createMigration } from './index.js';

const log = metalogger();

createMigration(process.argv.slice(-1)[0])
  .then(r => log.info(r))
  .catch(e => log.error(e));
