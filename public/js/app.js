/**
 * @file
 * js/app.js
 *
 * This is the main file for the web app. It loads up the application controller. The controller then takes over
 * and creates a model and attaches that model to views and gets ReactJS to render the app.
 */

import {AppController} from './controllers/app_controller.jsx'; 

let appController = new AppController();

appController.init();


