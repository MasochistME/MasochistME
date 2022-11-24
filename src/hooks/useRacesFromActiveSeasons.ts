import { useMemo } from 'react';
import { useSeasons, useRaces } from 'sdk';

export const useRacesFromActiveSeasons = () => {
	const {
		seasonsData: activeSeasons,
		isLoading: isSeasonsLoading,
		isFetched: isSeasonsFetched,
	} = useSeasons({
		filter: { active: true },
	});
	const {
		racesData,
		isLoading: isRacesLoading,
		isFetched: isRacesFetched,
	} = useRaces();

	const isLoading = isRacesLoading && isSeasonsLoading;
	const isFetched = isRacesFetched && isSeasonsFetched;

	const currentSeasonRaces = useMemo(() => {
		const activeSeasonIds = activeSeasons.map(season => String(season._id));
		return racesData.filter(
			race => race.season && activeSeasonIds.includes(race.season),
		);
	}, [activeSeasons, racesData]);

	return { activeSeasons, currentSeasonRaces, isLoading, isFetched };
};
