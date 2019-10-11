'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RapidformSchema extends Schema {
  up () {
    this.create('rapidforms', (table) => {
      table.increments()

      table.string('name', 250).notNullable().unique() // facture
      table.string('name_ar', 250)
      table.string('name_fr', 250)
      table.string('title', 250).notNullable() // Facture
      table.text('description') // document description
      table.text('country')
      table.boolean('featured').notNullable().defaultTo('0') // document description
      table.string('logo',250)
      table.timestamps()

    })
  }

  down () {
    this.drop('rapidforms')
  }
}

module.exports = RapidformSchema
