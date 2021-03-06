/**
 * src/config.js: application configuration loader
 *
 * Copyright 2016 Sudaraka Wijesinghe <sudaraka@sudaraka.org>
 *
 * This program comes with ABSOLUTELY NO WARRANTY
 * This is free software, and you are welcome to redistribute it and/or modify
 * it under the terms of the BSD 2-clause License. See the LICENSE file for more
 * details.
 */

import path from 'path'
import os from 'os'

import { read as readConfig } from 'find-config'
import { compose, split, last, concat } from 'ramda'

import container from './containers/container'
import { toJSON } from './utils'
import pkg from '../package.json'

const
  pkgNameToAppName = compose(last, split('/')),

  defaultConfig = {
    'url': 'https://repo.sudaraka.org/backup/',
    'dest': path.join(os.homedir(), 'backup', 'sw-web1'),
    'cacheFile': path.join(os.homedir(), '.cache', pkgNameToAppName(pkg.name)),
    'telegramFile': path.join(os.homedir(), '.cache', `${pkgNameToAppName(pkg.name)}-telegram`),
    'stat': {},
    'telegram': {}
  }

export default container(pkg.name)
  // @ns/name => .name
  .map(compose(concat('.'), pkgNameToAppName))
  // Read file as text
  .map(readConfig)
  // Get JSON object
  .map(toJSON)
  // Apply default
  .map(c => ({
    ...defaultConfig,
    ...c
  }))
