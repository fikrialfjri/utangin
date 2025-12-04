/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'react-toastify';

import { type IMetaResponse } from '@/types/commons';

import instance from '@/utils/axios-instance';
import { getObjectSearch } from '@/utils/commons';

interface IActionOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error: any) => void;
}

interface IGetOptions extends IActionOptions {
  shouldFetch?: boolean;
  pagination?: boolean;
  saveQuery?: boolean;
  isShowNotification?: boolean;
  initialData?: any;
}

const defaultOptions = {
  shouldFetch: true,
  pagination: false,
  saveQuery: true,
  isShowNotification: false,
};

export const useGet = (url: string, query: any = {}, options?: IGetOptions) => {
  const [data, setData] = useState<any | null>(options?.initialData ?? null);
  const [meta, setMeta] = useState<IMetaResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [search, setSearch] = useSearchParams();
  const objectSearch = getObjectSearch(search);

  const currOptions = useMemo(() => {
    return { ...defaultOptions, ...options };
  }, [options]);

  useEffect(() => {
    if (currOptions.shouldFetch) {
      const payload = { ...objectSearch, ...query };

      const finalParams = currOptions.pagination
        ? { page: 1, limit: 10, ...payload }
        : payload;

      _fetchData(finalParams);

      if (currOptions.saveQuery) {
        setSearch(finalParams, { replace: true });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currOptions.shouldFetch, currOptions.pagination]);

  const _fetchData = async (params: any, customUrl?: string) => {
    try {
      setLoading(true);
      const response = await instance.get(customUrl ?? url, {
        params,
      });
      const currResponse = response.data;
      setData(currResponse.data);
      setMeta(currResponse.meta);
      if (currOptions?.onSuccess) currOptions.onSuccess(currResponse.data);
    } catch (err: any) {
      setData(null);
      const error = err.errors?.[0].message || err.message;
      setError(error);
      console.error(error);
      if (currOptions?.isShowNotification) toast.error(error);
      if (currOptions?.onError) currOptions.onError(err);
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
    refetch: (params: any = null, customUrl?: string) =>
      _fetchData(params || { ...objectSearch, ...query }, customUrl),
    setQueryParams: (object: any) =>
      currOptions?.saveQuery && setSearch(object, { replace: true }),
  };
};

export const usePost = (url: string, options?: IActionOptions) => {
  const [responseData, setResponseData] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [errorData, setErrorData] = useState(null);

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
      toast.success(res.data.message);
      if (options?.onSuccess) options.onSuccess(res.data);
    } catch (err: any) {
      setLoadingPost(false);
      const error = err.errors?.[0].message || err.message;
      console.error(error);
      toast.error(error);
      if (err.errors) setErrorData(err.errors);
      if (options?.onError) options.onError(err);
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
    errorData,
  };
};

export const usePut = (url: string, options?: IActionOptions) => {
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
      toast.success(res.data.message);
      if (options?.onSuccess) options.onSuccess();
    } catch (err: any) {
      setLoadingPut(false);
      const error = err.errors?.[0].message || err.message;
      console.error(error);
      toast.error(error);
      if (options?.onError) options.onError(err);
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

export const usePatch = (url: string, options?: IActionOptions) => {
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
      toast.success(res.data.message);
      if (options?.onSuccess) options.onSuccess();
    } catch (err: any) {
      setLoadingPatch(false);
      const error = err.errors?.[0].message || err.message;
      console.error(error);
      toast.error(error);
      if (options?.onError) options.onError(err);
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

export const useDelete = (url: string, options?: IActionOptions) => {
  const [loadingDelete, setLoadingDelete] = useState(false);

  const _handleDelete = async (customUrl?: string, params?: any) => {
    setLoadingDelete(true);

    try {
      await instance.delete(customUrl ?? url, params && { params });
      if (options?.onSuccess) options.onSuccess();
    } catch (err: any) {
      setLoadingDelete(false);
      const error = err.errors?.[0].message || err.message;
      console.error(error);
      toast.error(error);
      if (options?.onError) options.onError(err);
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
