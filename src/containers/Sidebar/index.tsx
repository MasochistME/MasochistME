import React from 'react';
import styled from 'styled-components';

import { fonts, media } from 'shared/theme';
import { SidebarSection } from './SidebarSection';

export enum SectionMap {
	UPDATE = 'update',
	TRIVIA = 'trivia',
	TOP = 'top',
	HISTORY = 'history',
	SALES = 'sales',
	DISCORD = 'discord',
}

export const Sidebar = (): JSX.Element => {
	const activeSections = [
		SectionMap.UPDATE,
		SectionMap.TRIVIA,
		SectionMap.TOP,
		SectionMap.HISTORY,
		SectionMap.SALES,
		SectionMap.DISCORD,
	];
	const sections = activeSections.map(
		(section: SectionMap, sectionIndex: number) => (
			<SidebarSection section={section} key={`section-${sectionIndex}`} />
		),
	);
	return <Wrapper>{sections}</Wrapper>;
};

const Wrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 30%;
	height: 100%;
	box-sizing: border-box;
	font-family: ${fonts.Raleway};

	@media (max-width: ${media.netbooks}) {
		display: none;
	}
`;
