import React from 'react';
import {
  SectionUpdate,
  SectionHistory,
  SectionTop,
  SectionTrivia,
  SectionSale,
  SectionDiscord,
  TSection,
} from './';

export type SidebarSectionProps = {
  section: TSection;
};

export default function SidebarSection(
  props: SidebarSectionProps,
): JSX.Element | null {
  const { section } = props;
  const getSection = (section: TSection) => {
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
}
