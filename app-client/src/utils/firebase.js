import firebase from 'firebase/app';
import 'firebase/auth';

const prodConfig = {
  apiKey: "AIzaSyBrjMV8EDEhxgXdcJ1GiYb2lxhYhHf7WR4",
  authDomain: "onlinemaktab-cf849.firebaseapp.com",
  databaseURL: "https://onlinemaktab-cf849.firebaseio.com",
  projectId: "onlinemaktab-cf849",
  storageBucket: "onlinemaktab-cf849.appspot.com",
  messagingSenderId: "792169172558",
  appId: "1:792169172558:web:c0db919d9d5642303a7d1f",




};

const devConfig = {
  apiKey: "AIzaSyBrjMV8EDEhxgXdcJ1GiYb2lxhYhHf7WR4",
  authDomain: "onlinemaktab-cf849.firebaseapp.com",
  databaseURL: "https://onlinemaktab-cf849.firebaseio.com",
  projectId: "onlinemaktab-cf849",
  storageBucket: "onlinemaktab-cf849.appspot.com",
  messagingSenderId: "792169172558",
  appId: "1:792169172558:web:c0db919d9d5642303a7d1f",
};

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const firebaseAuth = firebase.auth();

export {
  firebaseAuth,firebase
};
