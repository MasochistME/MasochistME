import React from 'react';
import styled from 'styled-components';

import { useAppContext } from 'context';
import { EventsDict, EventDict } from 'shared/config';
import { media } from 'shared/theme';
import { FilterBar, Flex } from 'components';

import { EventsFilterCheckbox } from './EventsFilterCheckbox';

export const EventsFilterBar = (): JSX.Element => {
	const { visibleEvents, setVisibleEvents } = useAppContext();

	return (
		<FilterBar>
			<StyledEventFilterBar>
				<StyledEventFilterBarCheckboxes>
					{EventsDict.map((event: EventDict) => (
						<EventsFilterCheckbox
							key={`checkbox-event-${event.type}`}
							event={event}
							visibleEvents={visibleEvents}
							setVisibleEvents={setVisibleEvents}
						/>
					))}
				</StyledEventFilterBarCheckboxes>
			</StyledEventFilterBar>
		</FilterBar>
	);
};

const StyledEventFilterBar = styled(Flex)`
	gap: 16px;
	flex-wrap: wrap;
	@media (max-width: ${media.smallNetbooks}) {
		justify-content: center;
	}
`;

const StyledEventFilterBarCheckboxes = styled(Flex)`
	justify-content: center;
	gap: 24px;
`;
