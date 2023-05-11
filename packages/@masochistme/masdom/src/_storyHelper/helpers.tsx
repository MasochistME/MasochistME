import React from 'react';

type StoryWrapperProps = { children: React.ReactNode };
export const StoryWrapper = ({ children }: StoryWrapperProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    {children}
  </div>
);

type StoryRowWrapperProps = { children: React.ReactNode; label: string };
export const StoryRowWrapper = ({ children, label }: StoryRowWrapperProps) => (
  <div style={{ display: 'flex', gap: '8px' }}>
    <h3 style={{ display: 'flex', flexWrap: 'wrap', width: '200px' }}>
      {label}
    </h3>
    {children}
  </div>
);
