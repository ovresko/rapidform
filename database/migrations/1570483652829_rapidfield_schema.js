'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RapidfieldSchema extends Schema {
  up () {
    this.create('rapidfields', (table) => {
      table.increments()

      table.string('name', 150).notNullable()
      table.integer('rapidform_id').notNullable()
      table.foreign('rapidform_id').references('rapidforms.id')
      table.string('title').notNullable()
      table.string('type').notNullable()
      table.string('section').notNullable()
      table.text('description')
      table.string('class')
      table.json('values')
      table.text('value','longtext').notNullable()

      table.string('rows')
      table.timestamps()
    })
  }

  down () {
    this.drop('rapidfields')
  }
}

module.exports = RapidfieldSchema
