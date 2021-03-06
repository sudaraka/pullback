/**
 * src/test/helpers.js: helper functions used in unit tests
 *
 * Copyright 2016 Sudaraka Wijesinghe <sudaraka@sudaraka.org>
 *
 * This program comes with ABSOLUTELY NO WARRANTY
 * This is free software, and you are welcome to redistribute it and/or modify
 * it under the terms of the BSD 2-clause License. See the LICENSE file for more
 * details.
 *
 */

import expect from 'expect'

const

  // Container must be a functor satisfying following conditions:
  //   - Is and Object
  //   - Containing map() method.
  //
  isFunctor = container => {
    it('must be an Object', () => {
      expect(container()).toBeAn(Object)
    })

    it('must implement a map() method', () => {
      expect(container().map).toBeAn(Function)
    })
  }

export { isFunctor }
