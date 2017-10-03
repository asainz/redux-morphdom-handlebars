import morphdom from 'morphdom';
import $ from 'jquery';

import {createStore} from 'redux';


const templates = {};
Array.prototype.slice.call(document.scripts).forEach((script) => {
    if (script.type === 'text/x-handlebars-template') {
        templates[script.id] = Handlebars.compile(script.innerHTML);
    }
});

Handlebars.registerHelper ('checked', function (value, currentValue) {
    return value == currentValue ? 'checked="checked"' : '';
});

Handlebars.registerHelper ('selected', function (value, currentValue) {
    return value == currentValue ? 'selected="selected"' : '';
});

const initialState = {
    addDescription: false,
    description: '',
    rooms: []
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'ADD_DESCRIPTION_CHANGE':
        return Object.assign({}, state, {addDescription: action.payload.addDescription});

    case 'DESCRIPTION_TYPE':
        return Object.assign({}, state, {description: action.payload.description});
    default: return state;
    }
};

const store = createStore(appReducer);

$(document).on('change', '[name="add-description"]', (e) => {
    store.dispatch({
        type: 'ADD_DESCRIPTION_CHANGE',
        payload: {
            addDescription: e.target.value === 'yes'
        }
    });
});

$(document).on('keyup', '[name="description"]', (e) => {
    store.dispatch({
        type: 'DESCRIPTION_TYPE',
        payload: {
            description: e.target.value
        }
    });
});

const render = () => {
    const mainFormTemplate = templates['main-form-tmpl'];
    morphdom($('#app')[0], `<div>${mainFormTemplate(store.getState())}</div>`, {childrenOnly: true});
};

store.subscribe(() => {
    window.console.log(store.getState());
    render();
});

render();
