"use strict";
const Antl = use('Antl')
class HomeController {

    index({session, view, request }) {
        //

        return view.render("pages.home.index", {  active: 'Home', title: "Home", subtitle: 'Gérer vos documents', locales: Antl.availableLocales() });
    }
}

module.exports = HomeController;
