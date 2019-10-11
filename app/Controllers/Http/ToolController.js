'use strict'
const Rapidform = use('App/Models/Rapidform')
const Rapidtemplate = use('App/Models/Rapidtemplate')
var rend = require('../../../rapidrender/engine/rapidrender.js')

class ToolController {

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  checkEmptyPLaceholder(j) {

    if (j && !j['placeholder']) {

      j['placeholder'] = j['title'];

    }
  }
  async show({ session, view, params, response,request }) {

    var id = params.id;

    var templateId = request.only(['template']);

    session.put('template',templateId.template);

    var form = await Rapidform.find(id);

    session.put('form', id);
    if (form) {

      var res = [];
      var sessionForm = session.get(id);
      var fields = await form.rapidfields().fetch();
      var json = fields.toJSON();
       if (sessionForm) {
        var e = this;
        Object.keys(sessionForm).forEach(function (a, index, e) {
          json.forEach(j => {
            if (j['name'] == a) {
              j['value'] = sessionForm[a]

              if (j['type'] == "check" || j['type'] == "radio") {
                if (sessionForm[a]) {
                  j.values.map(val => {
                    val.checked = '';
                    if (sessionForm[a] == val.name) {
                      val.checked = '1';
                    }
                    else if (sessionForm[a].values && (sessionForm[a].includes(val.name))) {
                      val.checked = '1';
                    }
                  })
                }
              }
            }
          });
        });

      }

      json.forEach(j => {
        this.checkEmptyPLaceholder(j);

        if (!sessionForm || !j['value'] || j['value'] == 'null')
          j['value'] = '';
      });

      const sections = this.groupBy(json, a => a.section);
      sections.forEach(a => {

        res.push({
          name: a[0].section,
          title: a[0].section,
          content: a
        });
      })

      return view.render('pages.rapidoc.a4', { id: id, title: form.title,country:form.country, mysubtitle: form.description, fields: res })
    } else {
      response.redirect('/404')
    }

  }

  async dorender({ request, session }) {
    //var ids = request.only(['id','temp_id']);
    //.id;
    var tempId = this.getTemplateIds(session);

    var id = this.getFormId(session);
    var sessionForm = session.get(id);

    if (!sessionForm)
      sessionForm = {};
    return await this.renderTempalte(tempId, sessionForm);
  }

  async renderTempalte(tempId, data) {

    var template = await Rapidtemplate.find(tempId);
    // return await rend.renderHTML(template.content,data);

    var pdfPath = await rend.createPDF(data, template.content, true);
    return { 'imgpath': pdfPath };

  }

  async doprint({session}){

    var tempId = this.getTemplateIds(session);

    var id = this.getFormId(session);

    var template = await Rapidtemplate.find(tempId);
    var sessionForm = session.get(id);

    if (!sessionForm)
      sessionForm = {};

    var html = await rend.renderHTML(template.content,sessionForm);
    return html;

  }

  getTemplateIds(session) {
    var t = session.get('template');

    return t;
  }

  getFormId(session) {
    return session.get('form');

  }

  async download({ session, request, params }) {
    const query = request.all()
    session.forget(params.id);

    session.put(params.id, query);

    try {
      var tempid = this.getTemplateIds(session);
      var template = await Rapidtemplate.find(tempid);
      var pdfPath = await rend.createPDF(query, template.content);

      return { 'pdfPath': pdfPath };
    }
    catch
    {

    }
  }

  // async save({ session, request, params }) {

  //   const query = request.all()
  //   session.forget(params.id);
  //
  //   session.put(params.id, query);

  //   // try {
  //   //   var tempid = this.getTemplateIds();
  //   //   var template = await Rapidtemplate.find(tempid);
  //   //   var pdfPath = await rend.createPDF(query, template.content);

  //   //   return { 'pdfPath': pdfPath };
  //   // }
  //   // catch
  //   // {

  //   // }

  // }

  clear({ session, params, response }) {
    session.forget(params.id);

  }

  async upload({ view, request, params }) {
    const Helpers = use('Helpers')
    const profilePic = request.file('profile_pic', {
      types: ['image'],
      size: '2mb'
    })

    var path = Helpers.publicPath('logos');
    var file_name =

      await profilePic.move(path, {
        overwrite: true
      })

    if (!profilePic.moved()) {
      return profilePic.error()
    }
    return "/logos/" + profilePic.fileName;

  }
}

module.exports = ToolController
