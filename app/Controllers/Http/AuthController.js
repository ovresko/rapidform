'use strict'
const User = use('App/Models/User')

class AuthController {

  async login({ auth,view, request, response }) {

    const { email, password } = request.all()
    try{
    await auth.attempt(email, password)

    response.route('account');
    }catch{
      return view.render('pages.account.login',{'merrors':"Can't connnect with those credentials !"})
    }
    // return 'Logged in successfully'
  }

  show({ auth, params, view }) {

    return view.render('pages.account.profile', { user: auth.user });
  }

  async signup({ request, session, response, view }) {
    const { validateAll } = use('Validator')

    const rules = {
      email: 'required|email|unique:users,email',
      password: 'required',
      username: 'required',
      passwordRepeat: 'required',
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password', 'passwordRepeat'])

      return response.redirect('back')
    }

    const user = new User()

    const _user = request.only(['username','email', 'password']);
    user.username = _user.username;
    user.password = _user.password;
    user.email = _user.email;
    console.log(_user);

    try {
      await user.save()
      return response.route('login')
    } catch (e) {
      return e;
    }

  }

}

module.exports = AuthController
