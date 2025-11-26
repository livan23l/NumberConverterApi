import { Controller } from './Controller.js';

export class MainController extends Controller {
    redirect() {
        return this._redirect('/en');
    }

    homeEn() {
        return this._view('en.home');
    }

    homeEs() {
        return this._view('es.home');
    }
}