import React from 'react';

import {
	SectionUpdate,
	SectionHistory,
	SectionTop,
	SectionTrivia,
	SectionSale,
	SectionDiscord,
} from './Sections';
import { SectionMap } from '.';

export type SidebarSectionProps = {
	section: SectionMap;
};

export const SidebarSection = (
	props: SidebarSectionProps,
): JSX.Element | null => {
	const { section } = props;
	const getSection = (section: SectionMap) => {
		switch (section) {
			case 'update':
				return <SectionUpdate />;
			case 'trivia':
				return <SectionTrivia />;
			case 'top':
				return <SectionTop />;
			case 'history':
				return <SectionHistory />;
			case 'discord':
				return <SectionDiscord />;
			case 'sales':
				return <SectionSale />;
			default:
				return null;
		}
	};

	return getSection(section);
};
