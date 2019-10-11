'use strict'
const Rapidtemplate = use('App/Models/Rapidtemplate')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with rapidtemplates
 */
class RapidtemplateController {
  /**
   * Show a list of all rapidtemplates.
   * GET rapidtemplates
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {

    var templates = null;
    var queryParam = request.only(['form']);

    if (queryParam && queryParam.form) {

      // query manual
      var rapidform_id = queryParam.form;
      var result = await Rapidtemplate.query().where(function () {

        this.where('rapidform_id', '=', rapidform_id)
      }) .with('rapidform').limit(10).fetch();

      templates = result.toJSON();
    }

     var featured= await Rapidtemplate.getFeatured().fetch()

    return view.render('pages.rapidoc.index', { featured: featured.toJSON(), templates: templates });

  }

  async find({ request, response }) {

    var queryParam = request.only(['form']);
    if (queryParam && queryParam.form) {

      // query manual
      var rapidform_id = queryParam.form;
      var result = await Rapidtemplate.query().where(function () {
        this.where('rapidform_id', '=', rapidform_id)
      }).limit(10).fetch();
      return result;

    } else {
      var req = request.input('name', '');
      if (req) {
        var result = await Rapidtemplate.query().where(function () {
          this.where('name', 'like', '%' + req + '%').orWhere('name_fr', 'like', '%' + req + '%').orWhere('title', 'like', '%' + req + '%').orWhere('description', 'like', '%' + req + '%').orWhere('name_ar', 'like', '%' + req + '%')
        }).limit(10).fetch();
        return result;
      } else {
        return [];
      }
    }

  }

  /**
   * Render a form to be used for creating a new rapidtemplate.
   * GET rapidtemplates/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new rapidtemplate.
   * POST rapidtemplates
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single rapidtemplate.
   * GET rapidtemplates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing rapidtemplate.
   * GET rapidtemplates/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update rapidtemplate details.
   * PUT or PATCH rapidtemplates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a rapidtemplate with id.
   * DELETE rapidtemplates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = RapidtemplateController
