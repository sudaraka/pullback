/**
 * src/containers/container__test.js: test for container.js
 *
 * Copyright 2016 Sudaraka Wijesinghe <sudaraka@sudaraka.org>
 *
 * This program comes with ABSOLUTELY NO WARRANTY
 * This is free software, and you are welcome to redistribute it and/or modify
 * it under the terms of the BSD 2-clause License. See the LICENSE file for more
 * details.
 *
 * Inspired by [Uses of Coyoneda in JS](https://www.youtube.com/watch?v=WH5BrkzGgQY)
 * by [Brian Lonsdorf](https://twitter.com/drboolean)
 *
 */

/* eslint-disable no-magic-numbers */

import expect, { spyOn } from 'expect'
import { isFunctor } from '../test/helpers'
import container from './container'

describe('Container', () => {
  isFunctor(container)

  describe('map() method', () => {
    it('should receive contained value', () => {
      container(42).map(val => {
        expect(val).toBe(42)

        return val
      })
    })

    it('should return a new container', () => {
      const
        containerA = container(42),
        containerB = containerA.map(val => val + 1)

      isFunctor(containerB)

      expect(containerB).toNotBe(containerA)

      containerB.map(val => {
        expect(val).toBe(43)

        return val
      })
    })

    it('should return same container when mapped with non function', () => {
      const
        containerA = container(42),
        containerB = containerA.map(),
        containerC = containerA.map(1),
        containerD = containerA.map('not a function'),
        containerE = containerA.map({})

      expect(containerB).toBe(containerA,
        'map with undefined returned a new container')
      expect(containerC).toBe(containerA,
        'map with number returned a new container')
      expect(containerD).toBe(containerA,
        'map with string returned a new container')
      expect(containerE).toBe(containerA,
        'map with object returned a new container')
    })

    it('should not execute given function', () => {
      const
        wrapper = { 'mapper': v => v + 1 },
        spy = spyOn(wrapper, 'mapper')

      container(42).map(wrapper.mapper)

      expect(spy).toNotHaveBeenCalled()
    })
  })

  describe('value() method', () => {
    it('should return the contained value', () => {
      expect(container(42).value()).toBe(42)
    })

    it('should execute all mapped functions', () => {
      const
        wrapper = {
          'mapper1': v => v + 1,
          'mapper2': v => `Answer is ${v}`
        },

        spy1 = spyOn(wrapper, 'mapper1'),
        spy2 = spyOn(wrapper, 'mapper2')

      container(41)
        .map(wrapper.mapper1)
        .map(wrapper.mapper2)
        .value()

      expect(spy1).toHaveBeenCalled('mapper1 was not called')
      expect(spy2).toHaveBeenCalled('mapper2 wasnot called')
    })

    it('should return mapped value', () => {
      const
        mapper1 = v => v + 1,
        mapper2 = v => `Answer is ${v}`,

        result = container(41)
          .map(mapper1)
          .map(mapper2)
          .value()

      expect(result).toBe('Answer is 42')
    })

    it('should not mutate parent container', () => {
      const
        mapper1 = v => v + 1,
        mapper2 = v => `Answer is ${v}`,

        result1 = container(41),
        result2 = result1.map(mapper1),
        result3 = result2.map(mapper2)

      expect(result1.value()).toBe(41)
      expect(result2.value()).toBe(42)
      expect(result3.value()).toBe('Answer is 42')
    })
  })
})

