/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

import { type IMetaResponse } from '@/types/commons';

import instance from '@/utils/axios-instance';
import { getObjectSearch } from '@/utils/commons';

interface IOptions {
  shouldFetch?: boolean;
  pagination?: boolean;
  saveQuery?: boolean;
  isShowNotification?: boolean;
  all?: boolean;
}

const defaultOptions = {
  shouldFetch: true,
  pagination: false,
  saveQuery: true,
  isShowNotification: false,
};

export const useGet = (
  url: string,
  query: any = {},
  options?: IOptions,
  actionAfterServices?: () => void,
) => {
  const [data, setData] = useState<any>(null);
  const [meta, setMeta] = useState<IMetaResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [search, setSearch] = useSearchParams();

  const objectSearch = getObjectSearch(search);

  const currOptions = useMemo(() => {
    if (options?.all) {
      return {
        ...defaultOptions,
        pagination: true,
        isShowNotification: true,
      };
    }

    if (options?.all === false) {
      return {
        ...defaultOptions,
        shouldFetch: false,
        saveQuery: false,
      };
    }

    return {
      ...defaultOptions,
      ...options,
    };
  }, [options]);

  useEffect(() => {
    if (currOptions?.shouldFetch) {
      const payload = { ...objectSearch, ...query };

      if (!currOptions?.pagination) {
        _fetchData(payload);

        if (currOptions?.saveQuery)
          return setSearch(payload, { replace: true });
        return;
      }

      _fetchData({ page: 1, limit: 10, ...payload });

      if (currOptions?.saveQuery)
        return setSearch({ page: 1, limit: 10, ...payload }, { replace: true });
    }
  }, [
    currOptions?.shouldFetch,
    currOptions?.pagination,
    currOptions?.saveQuery,
  ]);

  const _fetchData = async (params: any, customUrl?: string) => {
    try {
      setLoading(true);
      const response = await instance.get(customUrl ?? url, {
        params,
      });

      setData(response.data.data);
      setMeta(response.data.meta);
      if (actionAfterServices) actionAfterServices();
    } catch (err: any) {
      setData(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    meta,
    loading,
    error,
    objectSearch,
    refetch: (params: any = null, customUrl: string) =>
      _fetchData(params || { ...objectSearch, ...query }, customUrl),
    setQueryParams: (object: any) =>
      currOptions?.saveQuery && setSearch(object, { replace: true }),
  };
};

export const usePost = (url: string, actionAfterServices?: () => void) => {
  const [responseData, setResponseData] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);

  const _handlePost = async (
    payload: any,
    customUrl?: string,
    params?: any,
    headers?: any,
  ) => {
    setLoadingPost(true);

    try {
      const res = await instance.post(customUrl ?? url, payload, {
        params,
        headers,
      });
      setResponseData(res.data.data);
      if (actionAfterServices) actionAfterServices();
    } catch (err: any) {
      setLoadingPost(false);
      console.error(err.message);
      if (actionAfterServices) actionAfterServices();
    } finally {
      setLoadingPost(false);
    }
  };

  return {
    handlePost: (
      payload: any,
      customUrl?: string,
      params?: any,
      headers?: any,
    ) => _handlePost(payload, customUrl, params, headers),
    loadingPost,
    responseData,
  };
};

export const usePut = (url: string, actionAfterServices?: () => void) => {
  const [responseData, setResponseData] = useState(null);
  const [loadingPut, setLoadingPut] = useState(false);

  const _handlePut = async (payload: any, customUrl?: string, params?: any) => {
    setLoadingPut(true);

    try {
      const res = await instance.put(
        customUrl ?? url,
        payload,
        params && { params },
      );
      setResponseData(res?.data);
      if (actionAfterServices) actionAfterServices();
    } catch (err: any) {
      setLoadingPut(false);
      console.error(err.message);
      if (actionAfterServices) actionAfterServices();
    } finally {
      setLoadingPut(false);
    }
  };

  return {
    handlePut: (payload: any, customUrl?: string, params?: any) =>
      _handlePut(payload, customUrl, params),
    loadingPut,
    responseData,
  };
};

export const usePatch = (url: string, actionAfterServices?: () => void) => {
  const [responseData, setResponseData] = useState(null);
  const [loadingPatch, setLoadingPatch] = useState(false);

  const _handlePatch = async (
    payload: any,
    customUrl?: string,
    params?: any,
  ) => {
    setLoadingPatch(true);

    try {
      const res = await instance.patch(
        customUrl ?? url,
        payload,
        params && { params },
      );
      setResponseData(res?.data);
      if (actionAfterServices) actionAfterServices();
    } catch (err: any) {
      setLoadingPatch(false);
      console.error(err.message);
      if (actionAfterServices) actionAfterServices();
    } finally {
      setLoadingPatch(false);
    }
  };

  return {
    handlePatch: (payload: any, customUrl?: string, params?: any) =>
      _handlePatch(payload, customUrl, params),
    loadingPatch,
    responseData,
  };
};

export const useDelete = (url: string, actionAfterServices?: () => void) => {
  const [loadingDelete, setLoadingDelete] = useState(false);

  const _handleDelete = async (customUrl?: string, params?: any) => {
    setLoadingDelete(true);

    try {
      await instance.delete(customUrl ?? url, params && { params });
      if (actionAfterServices) actionAfterServices();
    } catch (err: any) {
      setLoadingDelete(false);
      console.error(err.message);
      if (actionAfterServices) actionAfterServices();
    } finally {
      setLoadingDelete(false);
    }
  };

  return {
    handleDelete: (customUrl?: string, params?: any) =>
      _handleDelete(customUrl, params),
    loadingDelete,
  };
};
