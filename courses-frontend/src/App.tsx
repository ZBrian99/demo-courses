import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme } from './styles/theme';
import AppRoutes from './routes/AppRoutes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import GlobalStyles from './styles/globalStyles';

const App = () => {
	return (
		<ThemeProvider theme={lightTheme}>
			<CssBaseline />
			<GlobalStyles />
			<Router>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<AppRoutes />
				</LocalizationProvider>
			</Router>
		</ThemeProvider>
	);
};

export default App;
