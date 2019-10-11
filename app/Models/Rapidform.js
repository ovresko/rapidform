'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Rapidform extends Model {

  rapidfields () {
    return this.hasMany('App/Models/Rapidfield')
  }

  getCountry(country){
      if(country)
        return country;
      return '';
  }

  static  getFeatured()
  {
    return this.query().where('featured','=', '1');
  }

  rapidtemplates () {
    return this.hasMany('App/Models/Rapidtemplate','id','rapidform_id')
  }

}

module.exports = Rapidform
