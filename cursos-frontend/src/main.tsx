import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import '@fontsource-variable/rubik';
// import '@fontsource-variable/jost';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { setupAxiosInterceptors } from './config/apiConfig';

setupAxiosInterceptors(store.dispatch);




ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	// <React.StrictMode>
	<Provider store={store}>
		<App />
	</Provider>
	// </React.StrictMode>
);