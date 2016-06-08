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

import { readFileSync, writeFile } from 'fs'
import fetch from 'node-fetch'

import { toJSON } from './utils'

const
  telegramAPI = `https://api.telegram.org/bot${process.env.TG_API_KEY || ''}/`,  // eslint-disable-line no-process-env

  handleTelegramRequests = cfg => {
    const
      updateOffset = parseInt(cfg.telegram.lastUpdate || 0, 10) + 1

    fetch(`${telegramAPI}getUpdates?offset=${updateOffset}`)

      // Get JSON object
      .then(res => res.json())

      .then(res => {
        if(res.ok) {  // API returned successful result
          res.result.reduce((cache, update) => {
            const
              { text, 'chat': { id, first_name } } = update.message,
              subscribers = new Set(cache.subscribers)

            cache.lastUpdate = update.update_id

            if(text.startsWith('/start')) {
              subscribers.add(id)

              sendMessage(`Hi ${first_name},\n\nYou have been subscibeded to receive *pullback* notifications`, id)
            }
            else if(text.startsWith('/stop')) {
              subscribers.delete(id)

              sendMessage(`Hi ${first_name},\n\nYou were unsubscibeded from receiving *pullback* notifications`, id)
            }

            cache.subscribers = [ ...subscribers ]

            return cache
          }, cfg.telegram)

          writeFile(cfg.telegramFile, JSON.stringify(cfg.telegram, null, 2))
        }
      })

    return cfg
  },

  readTelegramCache = cfg => {
    let
      telegramContent = '{"lastUpdate": null, "subscribers": []}'

    try {
      telegramContent = readFileSync(cfg.telegramFile, 'utf8')
    }
    catch(ex) {}  // eslint-disable-line no-empty

    return {
      ...cfg,
      'telegram': toJSON(telegramContent)
    }
  },

  sendMessage = (text, chat_id) => {
    const
      apiCall = {
        'method': 'POST',
        'headers': { 'content-type': 'application/json' },
        'body': JSON.stringify({
          'parse_mode': 'markdown',
          text,
          chat_id
        })
      }

    fetch(`${telegramAPI}sendMessage`, apiCall)
  }

export { readTelegramCache, handleTelegramRequests, sendMessage }
