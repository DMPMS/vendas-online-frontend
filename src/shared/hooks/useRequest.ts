import { useState } from 'react';

import { AuthType } from '../../modules/login/types/AuthType';
import { ERROR_INVALID_PASSWORD } from '../constants/errosStatus';
import { URL_AUTH } from '../constants/urls';
import { setAuthorizationToken } from '../functions/connection/auth';
import ConnectionAPI, {
  connectionAPIPost,
  MethodType,
} from '../functions/connection/connectionAPI';
import { useGlobalContext } from './useGlobalContext';

export const useRequests = () => {
  const [loading, setLoading] = useState(false);
  const { setNotification, setUser } = useGlobalContext();

  const request = async <Type>(
    url: string,
    method: MethodType,
    saveGlobal?: (object: Type) => void,
    body?: unknown,
  ): Promise<Type | undefined> => {
    setLoading(true);
    const returnObject: Type | undefined = await ConnectionAPI.connect<Type>(url, method, body)
      .then((result) => {
        if (saveGlobal) {
          saveGlobal(result);
        }
        return result;
      })
      .catch((error: Error) => {
        setNotification(error.message, 'error');
        return undefined;
      });
    setLoading(false);

    return returnObject;
  };

  const authRequest = async (body: unknown): Promise<void> => {
    setLoading(true);

    await connectionAPIPost<AuthType>(URL_AUTH, body)
      .then((result) => {
        setUser(result.user);
        setAuthorizationToken(result.accessToken);
        location.href = '/';
        return result;
      })
      .catch(() => {
        setNotification(ERROR_INVALID_PASSWORD, 'error');
        return undefined;
      });

    setLoading(false);
  };

  return {
    loading,
    authRequest,
    request,
  };
};
