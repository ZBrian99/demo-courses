import { BorderBottom } from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
	interface Palette {
		assets: Palette['primary'];
		textColors: {
			primary: string;
			secondary: string;
		};
		gray: {
			[key: number]: string;
		};
		cyan: {
			[key: number]: string;
		};
		violet: {
			[key: number]: string;
		};
		state: {
			success: {
				lighter: string;
				light: string;
				main: string;
				dark: string;
			};
			warning: {
				lighter: string;
				light: string;
				main: string;
				dark: string;
			};
			error: {
				lighter: string;
				light: string;
				main: string;
				dark: string;
			};
			info: {
				lighter: string;
				light: string;
				main: string;
				dark: string;
			};
			inactive: {
				lighter: string;
				light: string;
				main: string;
				dark: string;
			};
			default: {
				lighter: string;
				light: string;
				main: string;
				dark: string;
			};
		};
	}
	interface PaletteOptions {
		assets?: PaletteOptions['primary'];
		textColors?: {
			primary: string;
			secondary: string;
		};
		gray?: {
			[key: number]: string;
		};
		cyan?: {
			[key: number]: string;
		};
		violet?: {
			[key: number]: string;
		};
		state: {
			success: {
				lighter?: string;
				light: string;
				main: string;
				dark: string;
			};
			warning?: {
				lighter?: string;
				light: string;
				main: string;
				dark: string;
			};
			error?: {
				lighter?: string;
				light: string;
				main: string;
				dark: string;
			};
			info?: {
				lighter?: string;
				light: string;
				main: string;
				dark: string;
			};
			inactive?: {
				lighter?: string;
				light: string;
				main: string;
				dark: string;
			};
			default?: {
				lighter?: string;
				light: string;
				main: string;
				dark: string;
			};
		};
	}
}

const lightTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#A045D3',
			light: '#F6ECFB',
			dark: '#8037A9',
			contrastText: '#FFFFFF',
		},
		secondary: {
			main: '#E9FCFB',
			light: '#F7FCFD',
			dark: '#BCF5F4',
			contrastText: '#2E3232',
		},
		assets: {
			main: '#F8F7D8',
			light: '#F8EDD8',
			dark: '#F8D8DA',
		},
		textColors: {
			primary: '#2E3232',
			secondary: '#636C6B',
		},
		common: {
			black: '#000000',
			white: '#FCFCFC',
		},
		gray: {
			900: '#140F16',
			800: '#392C3F',
			700: '#6A616E',
			600: '#ABA7AC',
			500: '#C2BEC3',
			300: '#E1DFE2',
			100: '#F9F9FA',
		},
		cyan: {
			500: '#FFC900',
			300: '#FFEEB0',
			150: '#FFF7D9',
			100: '#FFFAE6',
		},
		violet: {
			900: '#340A48',
			800: '#68158F',
			700: '#74179F',
			500: '#D4B7E1',
			300: '#F1E8F5',
		},
		state: {
			success: {
				lighter: '#F5FBF7',
				light: '#E8F8ED',
				main: '#38B96E',
				dark: '#2D9357',
			},
			warning: {
				lighter: '#FFFAF0',
				light: '#FFF4E5',
				main: '#FFA500',
				dark: '#CC8400',
			},
			error: {
				lighter: '#FEF5F5',
				light: '#FEECEB',
				main: '#E53935',
				dark: '#B71C1C',
			},
			info: {
				lighter: '#F5FAFF',
				light: '#E8F4FD',
				main: '#2196F3',
				dark: '#1565C0',
			},
			inactive: {
				lighter: '#FAFBFC',
				light: '#F5F7F8',
				main: '#78909C',
				dark: '#546E7A',
			},
			default: {
				lighter: '#FAFAFA',
				light: '#F5F5F5',
				main: '#FFFFFF',
				dark: '#E0E0E0',
			},
		},
		background: {
			default: '#FFFFFF',
			paper: '#F8F7F9',
		},
	},
	typography: {
		fontFamily: 'Roboto, sans-serif',
		h1: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 700,
			fontSize: '48px',
		},
		h2: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 700,
			fontSize: '36px',
		},
		h3: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 700,
			fontSize: '32px',
		},
		h4: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 500,
			fontSize: '24px',
		},
		h5: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 500,
			fontSize: '20px',
		},
		h6: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 500,
			fontSize: '16px',
		},
		body1: {
			fontSize: '16px',
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 400,
		},
		body2: {
			fontSize: '14px',
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 400,
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					'&::-webkit-scrollbar, & *::-webkit-scrollbar': {
						width: 8,
						height: 8,
					},
					'&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
						borderRadius: 16,
						backgroundColor: '#C2BEC3',
					},
					'&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
						backgroundColor: '#ABA7AC',
					},
					'&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
						backgroundColor: '#ABA7AC',
					},
					'&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
						backgroundColor: '#ABA7AC',
					},
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					borderWidth: '1px',
					borderStyle: 'solid',
					backgroundColor: 'transparent', // Fondo transparente por defecto
					borderRadius: '.25rem',
					fontWeight: 500,
					'&.MuiChip-colorPrimary': {
						borderColor: '#8A2DBE',
						color: '#8A2DBE',
						backgroundColor: '#F7EFFB', // Utiliza el color con opacidad para el fondo
					},
					'&.MuiChip-colorSecondary': {
						borderColor: '#8B8E9D',
						color: '#8B8E9D',
						backgroundColor: '#EEEEF1', // Fondo sutil del color secundario
					},
					'&.MuiChip-colorError': {
						borderColor: '#D32F2F',
						color: '#D32F2F',
						backgroundColor: '#FDE8E8', // Fondo sutil del color de error
					},
					'&.MuiChip-colorSuccess': {
						borderColor: '#299959',
						color: '#299959',
						backgroundColor: '#F7FDF9', // Fondo sutil del color de éxito
					},
					'&.MuiChip-colorWarning': {
						borderColor: '#FF9029',
						color: '#FF9029',
						backgroundColor: '#FFFAF5', // Fondo sutil del color de advertencia
					},
					'&.MuiChip-colorInfo': {
						borderColor: ' #00A6ED',
						color: ' #00A6ED',
						backgroundColor: '#F2F9FD', // Fondo sutil del color de información
					},
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundColor: '#FCFCFC',
				},
			},
		},
		MuiTableContainer: {
			styleOverrides: {
				root: {
					border: '1px solid #DEDFE3',
					borderRadius: '.5rem',
					'& .MuiTableCell-root': {
						borderBottom: '1px solid #DEDFE3',
            borderRight: '1px solid #DEDFE3',
            
					},
					'& .MuiTableCell-root:last-child': {
						borderRight: 'none',
					},
				
				
				},
			},
		},

		MuiTable: {
			styleOverrides: {
				root: {
					'& .MuiTableCell-root': {
						// border: '1px solid #DEDFE3',
					},
				},
			},
			defaultProps: {
				size: 'small', // Aplica el tamaño 'small' por defecto a todas las tablas
			},
		},
		MuiTableHead: {
			styleOverrides: {
				root: {
					'& .MuiTableRow-root': {
						backgroundColor: '#F0EFF1',
						'& .MuiTableCell-root': {
							padding: '1rem .5rem .5rem',
							color: '#2E3232',
							'&:nth-of-type(odd)': {
								backgroundColor: '#F0EFF1', // Color de fondo para filas impares
							},
							'&:nth-of-type(even)': {
								backgroundColor: '#F0EFF1', // Color de fondo para filas pares
							},
						},
					},
				},
			},
		},
	MuiTableRow: {
  styleOverrides: {
    root: {
      // Estilos base para filas
      '&:nth-of-type(odd)': {
        backgroundColor: '#FCFCFC', // Color de fondo para filas impares
      },
      '&:nth-of-type(even)': {
        backgroundColor: '#F8F7F9', // Color de fondo para filas pares
      },
      // Efecto hover sutil
      '&:hover': {
        backgroundColor: '#EFEFEF', // Cambia a un gris claro en hover
      },
    },
  },
},

		MuiTableCell: {
			styleOverrides: {
				root: {
					whiteSpace: 'nowrap',
					padding: '0rem .5rem',
					// borderBottom: '1px solid #DEDFE3',
          // borderRight: '1px solid #DEDFE3',
					verticalAlign: 'bottom',
					border: 'none',
					'&:last-child': {
						borderRight: 'none',
					},
					'&[data-sticky-cell]': {
						borderRight: '1px solid #DEDFE3',
						'&:last-child': {
							borderRight: '1px solid #DEDFE3',
						},
					},
				},
			},
		},
		MuiSvgIcon: {
			styleOverrides: {
				root: {},
			},
			defaultProps: {
				fontSize: 'small',
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
				},
			},
			defaultProps: {
				size: 'small',
			},
		},
	},
});

export { lightTheme };
