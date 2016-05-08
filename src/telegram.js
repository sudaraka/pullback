/**
 * src/telegram.js: Sub-routines related to Telegram API and local cache
 *
 * Copyright 2016 Sudaraka Wijesinghe <sudaraka@sudaraka.org>
 *
 * This program comes with ABSOLUTELY NO WARRANTY
 * This is free software, and you are welcome to redistribute it and/or modify
 * it under the terms of the BSD 2-clause License. See the LICENSE file for more
 * details.
 */

import { readFileSync } from 'fs'

import { toJSON } from './utils'

export const
  readTelegramCache = cfg => {
    let
      telegramContent = '{"lastUpdate": null, "subscribers": []}'

    try{
      telegramContent = readFileSync(cfg.telegramFile, 'utf8')
    }
    catch(ex) {}  // eslint-disable-line no-empty

    return { ...cfg, 'telegram': toJSON(telegramContent) }
  }
