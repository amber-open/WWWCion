import Vue from 'vue'
import {
  Vuetify,
  VApp,
  VCard,
  VDataTable,
  VDialog,
  VTextField,
  VDivider,
  VPagination,
  VForm,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions
} from 'vuetify'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VCard,
    VDataTable,
    VDialog,
    VTextField,
    VDivider,
    VPagination,
    VForm,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions
  },
  theme: {
    primary: '#607D8B',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    indigo: '#607D8B'
  },
  customProperties: true,
  iconfont: 'md',
})
