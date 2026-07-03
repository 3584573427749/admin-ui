import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

import { createVuetify } from 'vuetify';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default createVuetify({
    components,
    directives,

    defaults: {
        VTextField: {
            hideDetails: true
        },
        VSelect: {
            hideDetails: true
        },
        VCheckbox: {
            hideDetails: true
        }
    },
    theme: {
        defaultTheme: 'simningAx',

        themes: {
            simningAx: {
                colors: {
                    primary: '#2f7fd3'
                }
            }
        }
    }
});
