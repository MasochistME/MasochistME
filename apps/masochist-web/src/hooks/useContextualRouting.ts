import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { createSearchParams, useSearchParams } from 'react-router-dom';

type Param<T> = { key: string; value: T };

export const useContextualRouting = <T extends string>(param: Param<T>) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const route = useMemo(() => {
    return (searchParams.get(param.key) ?? param.value) as T;
  }, [searchParams]);

  const setRoute = <T extends string>(newRoute: T) => {
    setSearchParams({ [param.key]: newRoute }, { replace: true });
  };

  const navigateToRoute = (params: Record<string, string>) =>
    navigate({ pathname: '', search: `?${createSearchParams(params)}` });

  useEffect(() => {
    if (!route) setRoute(param.key);
    else setRoute(route);
  }, [route]);

  return { route, setRoute, navigateToRoute };
};
