import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { createSearchParams, useSearchParams } from 'react-router-dom';

export const useNavigateToTab = <T extends string>(initialTab: T) => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		if (!tab) setTab(initialTab);
	}, []);

	const tab = useMemo(() => {
		return searchParams.get('tab') ?? initialTab;
	}, [searchParams]);

	const setTab = <T extends string>(tab: T) => {
		setSearchParams({ tab });
	};

	const navigateToTab = (params: Record<string, string>) =>
		navigate({ pathname: '', search: `?${createSearchParams(params)}` });

	return { tab, setTab, navigateToTab };
};
