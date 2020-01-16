/* eslint-disable camelcase, react/no-array-index-key, global-require, import/no-dynamic-require */
import React from 'react';

const CharacterCard = (info) => {
  const name = 'Luke Skywalker';
  const height = '172';
  const mass = '77';
  const hair_color = 'blond';
  const skin_color = 'fair';
  const eye_color = 'blue';
  const birth_year = '19BBY';
  const gender = 'male';

  return (
    <article className="card charCard">
      <div className="charHeadContainer">
        <h3 className="charName">{name}</h3>
      </div>
      <ul className="charDetailsList">
        <li className="charDetail">Gender: {gender}</li>
        <li className="charDetail">Birth Year: {birth_year}</li>
        <li className="charDetail">Eye Color: {eye_color}</li>
        <li className="charDetail">Skin Color: {skin_color}</li>
        <li className="charDetail">Hair Color: {hair_color}</li>
        <li className="charDetail">Mass: {mass}</li>
        <li className="charDetail">Height: {height}</li>
      </ul>
    </article>
  );
};

export default CharacterCard;
