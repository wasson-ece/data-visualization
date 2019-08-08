// require('source-map-support').install();
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { ThemeProvider } from '@material-ui/styles';

require('../style/app.css');
import { theme } from '../style/theme';
import Application from './components/Application';
import store from './store';
const { init } =
    process.type === 'browser'
        ? require('@sentry/electron/dist/main')
        : require('@sentry/electron/dist/renderer');

init({ dsn: 'https://bdfedd41b9304cb2ae84eb83f7a88242@sentry.io/1525469' });

// Create main element
const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

// Title
document.title = 'Cooling Oven';

// Render components
const render = (Component: () => JSX.Element) => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <Component />
                </ThemeProvider>
            </Provider>
        </AppContainer>,
        mainElement
    );
};

render(Application);
