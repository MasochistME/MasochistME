import React from 'react';

export default function Loader({
  isActive,
}: {
  isActive: boolean;
}): JSX.Element | null {
  return isActive ? (
    <div>
      <i className="fas fa-hourglass"></i>
    </div>
  ) : null;
}
