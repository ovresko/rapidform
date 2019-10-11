'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Rapidtemplate extends Model {

  static  getFeatured()
  {
    return this.query().where('featured','=', '1');
  }

  rapidform () {
    return this.belongsTo('App/Models/Rapidform')
  }

}

module.exports = Rapidtemplate
