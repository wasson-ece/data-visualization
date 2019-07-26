import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { Router } from 'react-router-dom';
import history from './history';

import Root from './Root';

const Application = () => (
    <Router history={history}>
        <Root />
    </Router>
);

export default hot(Application);
