import './index.scss';

import { render } from 'lit-html';
import { autorun } from 'mobx';
import App from './App';
import AppStore from './stores/AppStore';

const store = new AppStore();

autorun(() => render(App(store), document.body));
