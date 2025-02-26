import {createTheme} from '@mui/material/styles';
import _merge from 'lodash.merge';

const defaultTheme = () => ({
    geometry: {
        logo: {
            maxWidth: '150px'
        }
    },
    palette: {
        primary: {
            light: '#009bdc',
            main: '#209fda',
            dark: '#005f87'
        },
        secondary: {
            light: '#f57c30',
            main: '#e57834',
            dark: '#bd5715'
        },
        // Text: {
        //     primary: 'rgba(255, 255, 255, 0.87)',
        //     secondary: 'rgba(0, 0, 0, 0.87)'
        // },
        background: {
            overlay: 'rgba(0,0,0,.75)',
            checkedAnswer: 'rgba(255,255,255,1)'
        },
        shadows: {
            overlay: {
                lg: 'inset 1140px 0 570px -570px rgba(0,0,0,.5)',
                xs: 'inset 500px 0 250px -250px rgba(0,0,0,.5)'
            }
        }
    },
    typography: {
        // AllVariants: {
        //     color: 'rgba(0, O, 0, 0.87)'
        // },
        fontFamily: ['Lato', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        // H3: {
        //     fontWeight: 300
        // },
        // h4: {
        //     fontWeight: 300
        // },
        h6: {
            fontWeight: 600
        },
        body1: {
            fontSize: '1.1rem'
        }
    },
    // Shape:{
    //     borderRadius:3
    // }
    transitions: {
        easing: {
            ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            header: 'cubic-bezier(.23,1,.32,1)'
        },
        duration: {
            long: 600
        }
    },
    spacing: 8,
    overrides: {
        // MuiCheckbox: {
        //     root: {
        //         color: 'rgba(255, 255, 255, 0.87)'
        //     }
        // },
        // MuiRadio: {
        //     root: {
        //         color: 'rgba(255, 255, 255, 0.87)'
        //     }
        // },
        // MuiButton: {
        //     contained: {
        //         '&$disabled': {
        //             color: 'rgba(255, 255, 255, 0.26)',
        //             backgroundColor: 'rgba(255, 255, 255, 0.12)'
        //         }
        //     }
        //
        // },
        MuiTypography: {
            body1: {
                '& a': {
                    color: '#007cb0'
                }
            }
        }
        // MuiCssBaseline: {
        //     '@global': {
        //         // '@font-face': ['Lato'],
        //         '.Mui-disabled': {
        //             color: "rgba(255, 255, 255, 0.26)",
        //             backgroundColor: "rgba(255, 255, 255, 0.12)"
        //         }
        //
        //     },
        // },
    },
    props: {
        // MuiButton: {
        //     disableRipple: true,
        //     color: 'primary',
        //     variant: 'contained'
        // },

        MuiCheckbox: {
            disableRipple: true,
            color: 'primary'
        },
        MuiRadio: {
            disableRipple: true,
            color: 'primary'
        },
        MuiInputBase: {
            disableRipple: true,
            color: 'primary'
        }
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableRipple: true,
                color: 'primary',
                variant: 'contained'
            }
        },
        MuiIconButton: {
            defaultProps: {
                disableRipple: true
            }
        }
    }
});

const getTheme = userTheme => {
    const targetTheme = defaultTheme();
    const theme = createTheme(_merge(targetTheme, userTheme));
    return theme;
};

export default getTheme;
