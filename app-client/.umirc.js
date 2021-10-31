// ref: https://umijs.org/config/
import {resolve} from "path";

export default {
  treeShaking: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        {
          path: '/login',
          component: './login',
        },
        {
          path: '/',
          component: './login',
        },
        {
          path: '/dashboard',
          component: './dashboard',
        },
        {
          path: '/order',
          component: './order',
        },
        {
          path: '/finance',
          component: './finance',
        },
        {
          path: '/client',
          component: './client',
        },
        {
          path: '/supplier',
          component: './supplier',
        },
        {
          path: '/report',
          component: './report',
        },
        {
          path: '/calendar',
          component: './calendar',
        },
        {
          path: '/catalog',
          component: './catalog',
        },
        {
          path: '/404',
          component: './404',
        },
      ],
    },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'app-client',
        dll: false,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
  proxy: {
    "/api": {
      "target": "http://localhost:80/",
      "changeOrigin": true
    }
  },
  alias: {
    utils: resolve(__dirname, "./src/utils"),
    config: resolve(__dirname, "./src/utils/config"),
    components: resolve(__dirname, "./src/components"),
  },
  outputPath:'../app-server-side/src/main/resources/static'

};
