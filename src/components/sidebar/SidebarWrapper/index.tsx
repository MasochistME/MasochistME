import React from 'react';
import styled from 'styled-components';
import { TSection } from '../';
import { fonts, media } from 'shared/theme';
import SidebarSection from '../SidebarSection';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  height: 100%;
  box-sizing: border-box;
  font-family: ${fonts.fontRaleway};

  @media (max-width: ${media.netbooks}) {
    display: none;
  }
`;

export default function SidebarWrapper(): JSX.Element {
  const activeSections: TSection[] = [
    'update',
    'trivia',
    'top',
    'history',
    'sales',
  ];
  const sections = activeSections.map(
    (section: TSection, sectionIndex: number) => (
      <SidebarSection section={section} key={`section-${sectionIndex}`} />
    ),
  );
  return <Wrapper>{sections}</Wrapper>;
}
