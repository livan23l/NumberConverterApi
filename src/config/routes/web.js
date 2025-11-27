import { Router } from './Router.js';
import { MainController } from '../../app/controllers/MainController.js';

Router.GET('/', [MainController, 'redirect']);

/** Home page */
Router.GET('/en', [MainController, 'homeEn']);
Router.GET('/es', [MainController, 'homeEs']);

/** Converter page */
Router.GET('/en/converter', [MainController, 'converterEn']);
Router.GET('/es/converter', [MainController, 'converterEs']);