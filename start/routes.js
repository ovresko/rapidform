'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('404',({view}) => {
  return view.render('pages.404')
}).as('404')
Route.get('/', 'HomeController.index').as('home')
Route.get('login', async ({ view, auth, response }) => {
  return view.render('pages.account.login')
}).middleware('guest').as('login')

Route.get('signup', ({ view }) => {
  return view.render('pages.account.signup')
}).as('signup')

Route
  .post('login', 'AuthController.login')
  .middleware('guest')

  Route
  .post('signup', 'AuthController.signup')
  .middleware('guest')

Route
  .get('account', 'AuthController.show')
  .middleware('auth').as('account')

Route
  .get('logout', async ({ auth, response }) => {
    await auth.logout();
    response.route('home')
  })
  .middleware('auth').as('logout')

Route.group(() => {
  Route.get('/find','RapidtemplateController.find')

  Route.get('/dorender','ToolController.dorender').middleware('throttle:10')
  Route.get('/doprint','ToolController.doprint').middleware('throttle:10')
  Route.get('/', 'RapidtemplateController.index').as('tools').middleware('throttle:10')
  Route.get('/:id', 'ToolController.show').as('a4')
  Route.post('/upload/:file_name?', 'ToolController.upload')
  // Route.post('/save/:id', 'ToolController.save').middleware('throttle:10')
  Route.post('/download/:id', 'ToolController.download')
  Route.post('/clear/:id', 'ToolController.clear')
}).prefix('tools')

Route.get('/switch/:lang', ({ params, antl, request, response }) => {
  const locales = antl.availableLocales()
  if (locales.indexOf(params.lang) > -1) {
    response.cookie('lang', params.lang, { path: '/' })
  }
  response.redirect('back')
})
