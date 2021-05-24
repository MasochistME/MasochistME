import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Input, InputNumber, Checkbox, Button, Select } from 'antd';
import { Flex } from 'shared/components';
import nobadge from 'shared/images/data-not-found.svg';

const { Option: SelectOption } = Select;

const Option = styled.span`
  width: auto;
  min-width: 100px;
`;
const OptionRow = styled(Flex)`
  margin: 4px 0;
`;

type Badge = {
  description: string;
  enabled?: boolean;
  game?: string;
  gameId?: string;
  img: string;
  isNonSteamGame?: boolean;
  legacy?: boolean;
  name: string;
  points: string;
  requirements: string;
  _id: string;
};

type Props = {
  selectedBadge?: Badge;
};
export default function BadgeEditSection(props: Props): JSX.Element {
  const { selectedBadge = undefined } = props;
  const games = useSelector((state: any) => state.games.list);
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState<string | number | undefined>();
  const [points, setPoints] = useState<number>(0);
  const [legacy, setLegacy] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');

  useEffect(() => {
    setName(selectedBadge?.name ?? '');
    setDescription(selectedBadge?.description ?? '');
    setRequirements(selectedBadge?.requirements ?? '');
    setLegacy(selectedBadge?.legacy ?? false);
    setEnabled(selectedBadge?.enabled ?? true);
    setPoints(Number(selectedBadge?.points) ?? 0);
    setGameId(selectedBadge?.game ?? selectedBadge?.gameId ?? '');
  }, [selectedBadge]);

  const onNameChange = (event: any) => setName(event.target.value);
  const onDescriptionChange = (event: any) =>
    setDescription(event.target.value);
  const onRequirementsChange = (event: any) =>
    setRequirements(event.target.value);
  const onEnabledChange = (event: any) => setEnabled(event.target.checked);
  const onLegacyChange = (event: any) => setLegacy(event.target.checked);
  const onGameIdChange = (value: any) => setGameId(value);
  const onPointsChange = (value?: number | undefined | null | string) => {
    // TODO make it so you cannot input string
    if (typeof value === 'number') {
      setPoints(Number(value));
    }
  };
  // TODO add changing image
  // TODO add notification before saving
  // TODO add sending to server when saving badge
  // TODO add having active badge marked in the table

  const onSaveBadge = () => {
    const editedBadge = {
      ...selectedBadge,
      name,
      description,
      requirements,
      legacy,
      enabled,
      points: String(points),
      gameId, // TODO this might be non steam onw
    };
    console.log(editedBadge);
  };

  if (!selectedBadge) {
    return (
      <Flex column align justify>
        <img src={nobadge} alt="Badge not selected" />
        <div>No badge selected.</div>
      </Flex>
    );
  }
  return (
    <Flex column style={{ width: '100%', margin: '8px' }}>
      <OptionRow row align>
        <Option>Name</Option> <Input value={name} onChange={onNameChange} />
      </OptionRow>
      <OptionRow row align>
        <Option>Game</Option>
        <Select
          value={gameId}
          onChange={onGameIdChange}
          style={{ width: '100%' }}>
          {games.map((game: any) => (
            <SelectOption value={game.id}>{game.title}</SelectOption>
          ))}
        </Select>
      </OptionRow>
      <OptionRow row align>
        <Option>Description</Option>{' '}
        <Input value={description} onChange={onDescriptionChange} />
      </OptionRow>
      <OptionRow row align>
        <Option>Requirements</Option>
        <Input value={requirements} onChange={onRequirementsChange} />
      </OptionRow>
      <OptionRow row align>
        <Option>Points</Option>
        <InputNumber value={points} onChange={onPointsChange} step={1} />
      </OptionRow>
      <OptionRow row align>
        <Option>Legacy</Option>
        <Checkbox checked={legacy} onChange={onLegacyChange} />
      </OptionRow>
      <OptionRow row align>
        <Option>Enabled</Option>
        <Checkbox checked={enabled} onChange={onEnabledChange} />
      </OptionRow>
      <OptionRow row style={{ justifyContent: 'flex-end' }}>
        <Button type="primary" danger onClick={onSaveBadge}>
          Save badge
        </Button>
      </OptionRow>
    </Flex>
  );
}
