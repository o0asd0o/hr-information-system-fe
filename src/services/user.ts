import request from '@/utils/request';
import { LoginParamsType } from './login';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

export async function login(params: LoginParamsType): Promise<any> {
  return request('users/login', {
    method: "POST",
    body: JSON.stringify({ user: params })
  });
}