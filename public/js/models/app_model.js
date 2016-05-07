/**
 * @file
 * js/models/app_model.js
 *
 * This is the one-and-only model for the application. The views (UI) of the app are a "projection" of the state stored
 * in the model. The model keeps track of the current "state" of the app (what screens should be showing) as well as the
 * list of most recent 10 inbox items from GMail. It also keeps track of the email that the user has clicked on and is
 * currently viewing.
 */


const AUTHORIZE_WITH_GMAIL = "AUTHORIZE_WITH_GMAIL";
const LOG_IN = "LOG_IN";
const SHOW_MESSAGES_LIST = "SHOW_MESSAGES_LIST";
const VIEW_MESSAGE = "VIEW_MESSAGE";
const COMPOSE_MESSAGE = "COMPOSE_MESSAGE";
const REPLY_TO_MESSAGE = "REPLY_TO_MESSAGE";
const SHOW_DISCONNECTED_POPUP = "SHOW_DISCONNECTED_POPUP";

class AppModel {

    constructor() {
       this.app = {
          online:true,
          userIsLoggedIn:false,
          viewState:AUTHORIZE_WITH_GMAIL
       }
       
       this.email = {
          messages:[]
       }
    }

    set viewState(newViewState) {
        this.app.viewState = newViewState;
    }

    get messages() {
       return this.email.messages;
    }
    set messages(messages) {
        this.email.messages = messages;
    }

    get selectedMessage() {
       return this.email.selectedMessage;
    }
    set selectedMessage(selectedMessage) {
        this.email.selectedMessage = selectedMessage;
    }

    get appOnline() {
       return this.app.online;
    }
    set appOnline(isOnline) {
        this.app.online = isOnline;
    }

    get userIsLoggedIn() {
       return this.app.userIsLoggedIn;
    }
    set userIsLoggedIn(isLoggedIn) {
        this.app.userIsLoggedIn = isLoggedIn;
    }



    static get AUTHORIZE_WITH_GMAIL() {
        return AUTHORIZE_WITH_GMAIL;
    }
    static get LOG_IN() {
        return LOG_IN;
    }
    static get SHOW_MESSAGES_LIST() {
        return SHOW_MESSAGES_LIST;
    }
    static get VIEW_MESSAGE() {
        return VIEW_MESSAGE;
    }
    static get COMPOSE_MESSAGE() {
        return COMPOSE_MESSAGE;
    }
    static get REPLY_TO_MESSAGE() {
        return REPLY_TO_MESSAGE;
    }
    static get SHOW_DISCONNECTED_POPUP() {
        return SHOW_DISCONNECTED_POPUP;
    }

}

export {AppModel}