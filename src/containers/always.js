/**
 * src/containers/always.js: Functor that always return same value
 *
 * Copyright 2016 Sudaraka Wijesinghe <sudaraka@sudaraka.org>
 *
 * This program comes with ABSOLUTELY NO WARRANTY
 * This is free software, and you are welcome to redistribute it and/or modify
 * it under the terms of the BSD 2-clause License. See the LICENSE file for more
 * details.
 *
 */

const
  // container :: a -> Container(a)
  container = value => {
    let
      // Closure prevents direct access to the contained value
      _value = null

    // Prototype for the container object exposed to outside. {{{
    class Container {
      constructor(newValue) {
        _value = newValue
      }

      // Container(a).map :: _ -> Container(a)
      map() {
        return this
      }

      // Container(a).value :: _ -> a
      value() {
        return _value
      }
    }
    // }}}

    return new Container(value)
  }

// Implements the "Coyoneda.lift(a)" pattern in a closure
export default container
