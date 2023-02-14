import { useMemo } from 'react';
import { useRaces, useSeasons } from 'sdk';

export const useRacesFromSeason = (selectedSeasonId?: string | null) => {
	const { seasonsData } = useSeasons({ sort: { startDate: 'desc' } });

	const { data: races = [] } = useRaces({
		filter: { season: selectedSeasonId, isDone: true },
	});

	const season = useMemo(() => {
		if (!selectedSeasonId) return null;
		return seasonsData.find(season => String(season._id) === selectedSeasonId);
	}, [selectedSeasonId]);

	const seasonsActive = useMemo(
		() => seasonsData.filter(season => !season.endDate),
		[seasonsData],
	);
	const seasonsDone = useMemo(
		() => seasonsData.filter(season => season.endDate),
		[seasonsData],
	);

	return {
		races,
		season,
		seasonsActive,
		seasonsDone,
	};
};
