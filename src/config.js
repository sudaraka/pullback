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

import { read as readConfig } from 'find-config'
import { split, last, concat } from 'ramda'

import container from './containers/container'
import pkg from '../package.json'

const
  defaultConfig = {
    'url': 'https://repo.sudaraka.org/backup/'
  }

export default container(pkg.name)
  .map(split('/')).map(last).map(concat('.'))   // @ns/name => .name
  .map(readConfig)                              // Read file as text
  .map(JSON.parse)                              // Get JSON object
  .map(c => Object.assign(defaultConfig, c))    // Apply default
