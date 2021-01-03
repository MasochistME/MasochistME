import React from 'react';

type TSupportParteonAvatar = {
  tier: any;
  avatar: any;
};

export function SupportPatreonAvatar(
  props: TSupportParteonAvatar,
): JSX.Element {
  const { tier, avatar } = props;

  return (
    <img
      className={`patron-avatar avatar-tier${tier}`}
      src={avatar}
      alt="avatar"
    />
  );
}

type TSupportPatron = {
  patron: any;
  tier: any;
};

export default function SupportPatron(props: TSupportPatron): JSX.Element {
  const { patron, tier } = props;

  return (
    <div className="patron">
      <SupportPatreonAvatar avatar={patron.avatar} tier={tier} />
      <p className="patron-nickname">{patron.name}</p>
    </div>
  );
}
