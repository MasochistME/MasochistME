import React from 'react';
import { EventType } from '@masochistme/sdk/dist/v1/types';

import { EventDict } from 'configuration';
import { Checkbox } from 'components';

type Props = {
	event: EventDict;
	visibleEvents: EventType[];
	setVisibleEvents: (visibleEvents: EventType[]) => void;
};

export const EventsFilterCheckbox = (props: Props): JSX.Element => {
	const { event, visibleEvents, setVisibleEvents } = props;

	return (
		<Checkbox
			icon={event.icon}
			itemType={event.type}
			itemDescription={event.description}
			visibleItems={visibleEvents}
			setVisibleItems={setVisibleEvents}
		/>
	);
};
