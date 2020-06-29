import React from 'react';
import ReactDOM from 'react-dom';
import './static/css/style.css';
import App from './App';
import App_load from './html_parts/App_load';
import * as serviceWorker from './serviceWorker';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(<App />, document.getElementById('app'));
// ReactDOM.render(<App_load />, document.getEslementById('loading'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
