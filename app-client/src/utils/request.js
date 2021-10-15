/* global window */
import axios from 'axios'
import cloneDeep from 'lodash'
import pathToRegexp from 'path-to-regexp'
//import {message} from 'antd'
import {CORS} from './config'
import router from 'umi/router';
import {TOKEN_NAME} from '@/constants';

const fetch = (options) => {
  let {
    method = 'get',
    data,
    url,
    headers = {}
  } = options;

  const cloneData = cloneDeep(data);

  try {
    let domain = '';
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      [domain] = url.match(/[a-zA-z]+:\/\/[^/]*/);
      url = url.slice(domain.length)
    }
    const match = pathToRegexp.parse(url);
    url = pathToRegexp.compile(url)(data);
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    //message.error(e.message)
  }

  let tokenHeader = '';
  try {
    const orderAppToken = localStorage.getItem(TOKEN_NAME);
    tokenHeader = {
      'Authorization': orderAppToken,
      ...headers
    };
  } catch (e) {
  }

  try{
    if (data.fileUpload) {
      tokenHeader = {
        ...tokenHeader,
        "Content-Type": "multipart/form-data"
      };
      headers = {
        ...headers,
        "Content-Type": "multipart/form-data"
      }
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append("type", data.type);
      data = formData;
    }
  } catch (e) {

  }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
        headers: tokenHeader
      });
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
        headers: tokenHeader
      });
    case 'post':
      return axios.post(url, headers['Content-Type'] ? data : cloneData, {headers: tokenHeader});
    case 'put':
      return axios.put(url, cloneData, {headers: tokenHeader});
    case 'patch':
      return axios.patch(url, cloneData, {headers: tokenHeader});
    default:
      return axios(options)
  }
};

export default function request(options) {
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`;
    if (window.location.origin !== origin) {
      if (CORS && CORS.indexOf(origin) > -1) {
        options.fetchType = 'CORS'
      }
      /*else if (YQL && YQL.indexOf(origin) > -1) {
        options.fetchType = 'YQL'
      }*/
      else {
        options.fetchType = 'JSONP'
      }
    }
  }

  return fetch(options).then((response) => {
    const {statusText, status} = response;
    let data = response.data;
    if (data instanceof Array) {
      data = {
        list: data,
      }
    }
    return Promise.resolve({
      success: true,
      message: statusText,
      statusCode: status,
      ...data,
    })
  }).catch((error) => {
    const {response} = error;
    let msg;
    let statusCode;
    if (response && response instanceof Object) {
      const {data, statusText} = response;
      statusCode = response.status;
      msg = data.message || statusText
    } else {
      statusCode = 600;
      msg = error.message || 'Network Error'
    }

    if (statusCode === 401) {
      router.push('/login');
      return;
    }
    /*if(statusCode===409){
      return {success: false, statusCode, message: msg}
    }*/
    if (statusCode >= 404 && statusCode < 422) {
      return {success: false, statusCode, message: msg}
      //router.push('/404');
    }

    /* eslint-disable */
    return Promise.reject({success: false, statusCode, message: msg})
  })
}
