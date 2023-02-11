import { useMemo } from 'react';
import { useRaces, useSeasons } from 'sdk';

export const useRacesFromSeason = (selectedSeasonId: string) => {
	const { seasonsData } = useSeasons({ sort: { startDate: 'desc' } });

	const season = useMemo(() => {
		return seasonsData.find(season => String(season._id) === selectedSeasonId);
	}, [selectedSeasonId]);

	const { data: races = [] } = useRaces({
		filter: { season: selectedSeasonId, isDone: true },
	});

	const seasonsActive = seasonsData.filter(season => !season.endDate);
	const seasonsDone = seasonsData.filter(season => season.endDate);

	return {
		races,
		season,
		seasonsActive,
		seasonsDone,
	};
};
