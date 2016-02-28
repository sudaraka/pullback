/**
 * src/containers/always__test.js: test for always.js
 *
 * Copyright 2016 Sudaraka Wijesinghe <sudaraka@sudaraka.org>
 *
 * This program comes with ABSOLUTELY NO WARRANTY
 * This is free software, and you are welcome to redistribute it and/or modify
 * it under the terms of the BSD 2-clause License. See the LICENSE file for more
 * details.
 *
 */

import expect, { spyOn } from 'expect'
import { is_functor } from '../test/helpers'
import container from './always'

describe('Always', () => {

  is_functor(container)

  describe('map() method', () => {

    it('should receive contained value', () => {
      container(42).map(val => {
        expect(val).toBe(42)
      })
    })

    it('should return the same container', () => {
      const
        container_a = container(42),
        container_b = container_a.map(val => val + 1)

      is_functor(container_b)

      expect(container_b).toBe(container_a)
    })

    it('should not mutate the contained value', () => {
      const
        container_a = container(42),
        container_b = container_a.map(val => val + 1)

      container_a.map(val => {
        expect(val).toBe(42)
      })

      container_b.map(val => {
        expect(val).toBe(42)
      })
    })

    it('should not execute given function', () => {
      const
        wrapper = {
          'mapper': v => v + 1
        },

        spy = spyOn(wrapper, 'mapper')

      container(42).map(wrapper.mapper)

      expect(spy).toNotHaveBeenCalled()
    })

  })

  describe('value() method', () => {

    it('should return the contained value', () => {
      expect(container(42).value()).toBe(42)
    })

    it('should return mapped but unmodified value', () => {
      const
        mapper1 = v => v + 1,
        mapper2 = v => `Answer is ${v}`,

        result = container(41)
          .map(mapper1)
          .map(mapper2)
          .value()

      expect(result).toBe(41)
    })

  })

})

