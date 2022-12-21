import * as dotenv from 'dotenv';

import { SDK } from 'v1/sdk';
import { RaceType } from 'v1/types';

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
		startDate: 1234,
		endDate: 1234,
		downloadLink: 'http://http.cat',
		downloadGrace: 120,
		uploadGrace: 120,
		owner: '165962236009906176',
		ownerTime: 11,
	},
});

console.log(race);
