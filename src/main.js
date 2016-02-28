/**
 * src/main.js: main module for `pullback` CLI utility
 *
 * Copyright 2016 Sudaraka Wijesinghe <sudaraka@sudaraka.org>
 *
 * This program comes with ABSOLUTELY NO WARRANTY
 * This is free software, and you are welcome to redistribute it and/or modify
 * it under the terms of the BSD 2-clause License. See the LICENSE file for more
 * details.
 */

import { readFileSync } from 'fs'

import config from './config'
import { toJSON } from './utils'

export default () => {
  const
    readCache = cfg => {
      let
        cacheContent = '{}'

      try{
        cacheContent = readFileSync(cfg.cacheFile, 'utf8')
      }
      catch(ex) {}  // eslint-disable-line no-empty

      return { ...cfg, 'cache': toJSON(cacheContent) }
    }

  console.log(JSON.stringify(

  config
    .map(readCache)
    .value()

  , null, 2))
}
