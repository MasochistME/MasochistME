import { useMemo } from 'react';
import { useSeasons, useRaces } from 'sdk';

/**
 * Returns a list of races belonging to currently active seasons
 */
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

/**
 * Returns a list of races belonging to all already finished seasons
 */
export const useRacesFromPastSeasons = () => {
	const {
		seasonsData: pastSeasons,
		isLoading: isSeasonsLoading,
		isFetched: isSeasonsFetched,
	} = useSeasons({
		filter: { finished: true },
	});
	const {
		racesData,
		isLoading: isRacesLoading,
		isFetched: isRacesFetched,
	} = useRaces();

	const isLoading = isRacesLoading && isSeasonsLoading;
	const isFetched = isRacesFetched && isSeasonsFetched;

	const pastSeasonRaces = useMemo(() => {
		const pastSeasonIds = pastSeasons.map(season => String(season._id));
		return racesData.filter(
			race => race.season && pastSeasonIds.includes(race.season),
		);
	}, [pastSeasons, racesData]);

	return { pastSeasons, pastSeasonRaces, isLoading, isFetched };
};
