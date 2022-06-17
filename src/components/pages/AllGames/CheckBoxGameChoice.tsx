import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showGamesRated } from 'shared/store/modules/CheckBoxes';
import { swapRatingToIcon } from 'shared/helpers';

type Props = {
  score: any;
  rating: any;
};

export default function CheckBoxGameChoice(props: Props): JSX.Element {
  const { score, rating } = props;
  const dispatch = useDispatch();
  const icon = swapRatingToIcon(score, rating);
  const gamesRated = useSelector((state: any) => state.showGamesRated);

  const changeRatingVisibility = (event: any): void => {
    let visibleGamesRatedArray = [];
    event.target.checked
      ? (visibleGamesRatedArray = [event.target.value].concat(gamesRated))
      : (visibleGamesRatedArray = gamesRated.filter(
          (rating: any) => rating !== event.target.value,
        ));
    dispatch(showGamesRated(visibleGamesRatedArray));
  };

  const checked = gamesRated.includes(score);

  return (
    <div>
      <input
        name="game"
        value={score}
        checked={checked}
        id={`game-choice-${score}`}
        className="game-choice-checkbox"
        type="checkbox"
        defaultChecked
        onChange={changeRatingVisibility}
        style={{ display: 'none' }}
      />
      <label className="checkbox-label" htmlFor={`game-choice-${score}`}>
        <i className={icon}></i>
      </label>
    </div>
  );
}
