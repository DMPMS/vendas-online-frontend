import axios, { AxiosRequestConfig } from 'axios';

import { ERROR_ACCESS_DANIED, ERROR_CONNECTION } from '../../constants/errosStatus';
import { MethodsEnum } from '../../enums/methods.enum';
import { getAuthorizationToken } from './auth';

export type MethodType = 'get' | 'post' | 'put' | 'patch' | 'delete';

export default class ConnectionAPI {
  static async call<Type>(url: string, method: MethodType, body?: unknown): Promise<Type> {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: getAuthorizationToken(),
        'Content-Type': 'application/json',
      },
    };

    switch (method) {
      case MethodsEnum.POST:
      case MethodsEnum.PUT:
      case MethodsEnum.PATCH:
        return (await axios[method]<Type>(url, body, config)).data;
      case MethodsEnum.GET:
      case MethodsEnum.DELETE:
      default:
        return (await axios[method]<Type>(url, config)).data;
    }
  }

  static async connect<Type>(url: string, method: MethodType, body?: unknown): Promise<Type> {
    return ConnectionAPI.call<Type>(url, method, body).catch((error) => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
          case 403:
            throw new Error(ERROR_ACCESS_DANIED);
          default:
            throw new Error(ERROR_CONNECTION);
        }
      }
      throw new Error(ERROR_CONNECTION);
    });
  }
}

export const connectionAPIGet = async <Type>(url: string): Promise<Type> => {
  return ConnectionAPI.connect<Type>(url, MethodsEnum.GET);
};

export const connectionAPIDelete = async <Type>(url: string): Promise<Type> => {
  return ConnectionAPI.connect<Type>(url, MethodsEnum.DELETE);
};

export const connectionAPIPost = async <Type>(url: string, body: unknown): Promise<Type> => {
  return ConnectionAPI.connect<Type>(url, MethodsEnum.POST, body);
};

export const connectionAPIPut = async <Type>(url: string, body: unknown): Promise<Type> => {
  return ConnectionAPI.connect<Type>(url, MethodsEnum.PUT, body);
};

export const connectionAPIPatch = async <Type>(url: string, body: unknown): Promise<Type> => {
  return ConnectionAPI.connect<Type>(url, MethodsEnum.PATCH, body);
};
