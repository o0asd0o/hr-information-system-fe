import { extend } from 'umi-request';

/**
 * headers
 */
const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * request
 */
const request = extend({
  headers,
  prefix: 'http://localhost:4000/api/',
});

export const getRequestWithToken = () => {
  const token = sessionStorage.getItem("token");
  headers.Authorization = `Bearer ${token}`;
  return extend({
    headers,
    prefix: 'http://localhost:4000/api/',
  });
};

export const getRequestWithFileUploadAndToken = () => {
  const token = sessionStorage.getItem("token");
  headers.Authorization = `Bearer ${token}`;
  headers['Accept'] = '*/*';
  delete headers['Content-Type']

  return extend({
    headers,
    prefix: 'http://localhost:4000/api/',
  });
}
export default request;