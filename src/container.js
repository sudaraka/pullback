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
  // id :: x -> x
  id = x => x,

  // compose :: (f, g) -> x -> f(g(x))
  compose = (f, g) => x => f(g(x)),

  // container :: a, f -> Container(a, f)
  // Implements the "Coyoneda.lift(a)" pattern in a closure
  container = (value, mapFunction) => {
    let
      // Closure prevents direct access to the contained value
      _value = null,

      // Composed function(s) received via map()
      _mapperQueue = null

    const
      // Prototype for the container object exposed to outside.
      Container = (newValue, newFunction) => {
        _value = newValue
        _mapperQueue = newFunction
      }

    // Container(a, f).map :: g -> Container(a, f(g))
    // Note: not using arrow function as `this` must bind to the inner scope.
    Container.prototype.map = function(f) {
      if('function' !== typeof f) {
        // When given `f` is not callable, return the same container.
        return this
      }

      // Return a container with a new closure environment
      return container(_value, compose(_mapperQueue, f))
    }

    // Container(a, f).value :: _ -> f(a)
    Container.prototype.value = () => _mapperQueue(_value)

    if('function' !== typeof mapFunction) {
      // Fall back to id function
      mapFunction = id
    }

    return new Container(value, mapFunction)
  }


export default container
