# Change Log

All notable changes to the **pullback** CLI utility.

Copyright 2016 Sudaraka Wijesinghe <sudaraka@sudaraka.org>

This program comes with ABSOLUTELY NO WARRANTY;
This is free software, and you are welcome to redistribute it and/or modify it
under the terms of the BSD 2-clause License. See the LICENSE file for more
details.

---

## [1.1.3] - 2016-09-11
### Fixed
- Issue with Telegram notification not showing up because of brackets in the
  message.

## [1.1.2] - 2016-07-01
### Changed
- Ignore file changes in less than 12 bytes to avoid anomaly in git repo
  backup.

## [1.1.1] - 2016-06-29
### Added
- Show archive file size difference in the notification.

## [1.1.0] - 2016-05-08
### Added
- Send Telegram notifications to subscribers about new downloads.
- Acknowledge subscription status by sending a message.
- Ability to send messages to Telegram bot subscribers.
- Update subscription cache file on each run of the application.
- Separate .cache data file for keep track of Telegram subscribers.

### Changed
- `babel` packages updated to latest version as of 2016-05-07

## [1.0.0] - 2016-03-12
### Added
- systemd unit files to run script periodically. (requires manual installation)
- `node-fetch` to fetch data over HTTP(S).
- Stage-2 `eslint` presets.
- `find-config` to read application configuration.
- Lazy evaluation mapped functions of the container.
- Container object to functionally process data
- `mocha` based unit test support.
- Basic buildable command line script.
- `babel` to transpile ES2015 code.
- `eslint` support.
- package.json: task & package management via `npm`.
- README, LICENSE and CHANGELOG
