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

import { readFileSync, createWriteStream, writeFile } from 'fs'
import { basename, dirname, join as path_join } from 'path'

import mkdirP from 'mkdirp'
import fetch from 'node-fetch'

import config from './config'
import { toJSON } from './utils'
import { readTelegramCache, handleTelegramRequests, sendMessage } from './telegram'

export default () => {
  const
    readCache = cfg => {
      let
        cacheContent = '{}'

      try {
        cacheContent = readFileSync(cfg.cacheFile, 'utf8')
      }
      catch(ex) {}  // eslint-disable-line no-empty

      return {
        ...cfg,
        'cache': toJSON(cacheContent)
      }
    }

  config
    .map(readCache)
    .map(readTelegramCache)
    .map(handleTelegramRequests)
    .map(cfg => {

      // Fetch JSON string from URL
      fetch(cfg.url)

        // Get JSON object
        .then(res => res.json())

        // Index stat by filename { filename: data }
        .then(list => list.reduce((acc, f) => {
          acc[f.name] = f
          cfg.stat[f.name] = f.size

          return acc
        }, {}))
        .then(list => {
          const
            changedFiles = Object.keys(list)
              .reduce((acc, fname) => {
                const
                  newSize = parseInt(list[fname].size, 10),
                  cacheSize = parseInt(cfg.cache[fname], 10),
                  diff = Math.abs(newSize - cacheSize)

                if(isNaN(diff) || 12 < diff) {
                  // Current file size is different or not found in cache.
                  // Download file
                  //
                  // [2016-07-01]; ignoring size difference of 4 bytes as backup
                  // of the git repo seem to add 3 x 4 byte chunks and revert.

                  acc.push(
                    fetch(`${cfg.url}${fname}`)
                    .then(res => ({
                      ...res,
                      'sizes': [
                        parseInt(cfg.cache[fname], 10),  // From
                        parseInt(list[fname].size, 10)  // To
                      ]
                    }))
                  )
                }

                return acc
              }, [])

          return Promise.all(changedFiles)
        })
        .then(list => {
          // Save files to disk

          mkdirP.sync(cfg.dest)

          list.forEach(f => {
            f.body.pipe(createWriteStream(path_join(cfg.dest, basename(f.url))))
          })

          // Update cache
          if(0 < list.length) {
            mkdirP(dirname(cfg.cacheFile))

            writeFile(cfg.cacheFile, JSON.stringify(cfg.stat, null, 2))

            list.forEach(f => {
              f.sizes = f.sizes.filter(s => !isNaN(s)).join(' -> ')  // show size as "from -> to"
            })

            cfg.telegram.subscribers.map(
              sendMessage.bind(
                null,
                `File(s) downloaded from server:\n\n- ${list.map(f => `${basename(f.url)} [ ${f.sizes} ]`).join('\n- ')}`
              )
            )
          }
        })
    })
    .value()

}
