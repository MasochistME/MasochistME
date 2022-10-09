import * as dotenv from 'dotenv';

import { SDK } from 'v2/sdk';
import { RaceType } from 'v2/types';

dotenv.config();

const sdk = new SDK({
	host: 'http://localhost:3002',
	authToken: process.env.AUTH_TOKEN,
});

const race = await sdk.createRace({
	race: {
		name: '',
		instructions: '',
		type: RaceType.SCORE_BASED,
		startTime: 1234,
		endTime: 1234,
		downloadLink: 'http://http.cat',
		downloadGrace: 120,
		uploadGrace: 120,
		organizer: '165962236009906176',
	},
});

console.log(race);
