'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Rapidfield extends Model {

  getValues(values){
    return JSON.parse(values);
  }
}

module.exports = Rapidfield
