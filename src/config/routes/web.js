import { Router } from './Router.js';
import { MainController } from '../../app/controllers/MainController.js';

Router.GET('/', [MainController, 'redirect']);
Router.GET('/en', [MainController, 'homeEn']);
Router.GET('/es', [MainController, 'homeEs']);