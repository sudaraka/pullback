/**
 * src/container.js: Functor to contain data
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

const
  // container :: a -> Container(a)
  // Implements the "Coyoneda.lift(a)" pattern in a closure
  container = value => {
    let
      // Closure prevents direct access to the contained value
      _value = null

      // Composed function(s) received via map()
      // _mapped = null

    const
      // Prototype for the container object exposed to outside.
      Container = newValue => {
        _value = newValue
      }

    // map :: f -> Container(f(a))
    // Note: not using arrow function as `this` must bind to the inner scope.
    Container.prototype.map = function(f) {
      if('function' !== typeof f) {
        // When given `f` is not callable, return the same container.
        return this
      }

      return container(f(_value))
    }

    return new Container(value)
  }


export default container
