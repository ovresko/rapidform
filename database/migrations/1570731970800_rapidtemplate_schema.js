'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RapidtemplateSchema extends Schema {
  up () {
    this.create('rapidtemplates', (table) => {
      table.increments()
      table.string('name', 150).notNullable().unique()
      table.integer('rapidform_id').notNullable()
      table.foreign('rapidform_id').references('rapidforms.id')
      table.text('content','longtext').notNullable()
      table.boolean('featured').notNullable().defaultTo('0') // document description
      table.string('name_ar', 250)
      table.string('name_fr', 250)
      table.string('title', 250).notNullable() // Facture
      table.text('description') // document description
      table.text('country')
       table.string('logo',250)
      table.timestamps()
    })
  }

  down () {
    this.drop('rapidtemplates')
  }
}

module.exports = RapidtemplateSchema
