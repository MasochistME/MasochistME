// import { Icon, IconType } from 'components';
import { Size, Variant } from 'common';
import React from 'react';

import './Button.scss';

type IconType = string; // TEMP TODO
type Props = {
  label?: string;
  icon?: IconType;
  iconPlacement?: 'left' | 'right';
  disabled?: boolean;
  toggled?: boolean;
  tooltip?: React.ReactNode;
  size?: Size;
  variant?: Variant;
  className?: string;
  theme?: 'ash' | 'dust' | 'meat';
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const Button = (props: Props) => {
  const {
    label,
    icon,
    iconPlacement = 'left',
    size = Size.MEDIUM,
    disabled = false,
    toggled = false,
    variant = Variant.DEFAULT,
    theme = 'ash', // TEMP
    // tooltip,
    onClick,
  } = props;

  return (
    <button
      className={[
        'button',
        `button--variant-${variant}`,
        `button--size-${size}`,
        disabled && 'button--disabled',
        toggled && 'button--toggled',
        // TODO find betterway to theme
        `theme-${theme}`,
      ].join(' ')}
      // iconOnly={!label}
      onClick={onClick}>
      {
        icon &&
          iconPlacement === 'left' &&
          'icon here' /** <Icon icon={icon} size={size / 3} />**/
      }
      {label && <span>{label}</span>}
      {
        icon &&
          iconPlacement === 'right' &&
          'icon here' /** <Icon icon={icon} size={size / 3} />**/
      }
    </button>
  );
};
