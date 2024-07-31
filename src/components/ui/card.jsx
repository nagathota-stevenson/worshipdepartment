import React from 'react';
import PropTypes from 'prop-types';
import './card.css';

const Card = ({ heading, subText, headingIcon, backgroundImage, childComponent }) => {
  return (
    <div className="card" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="card-overlay">
        <div className="card-left">
          <div className="card-heading-container">
            <h1 className="card-heading">{heading}

              
            </h1>
            <img
              src={headingIcon}
              className="heading-icon"
              alt="Heading Icon"
            />
            
          </div>
          <p className="card-sub-text">{subText}</p>
        </div>
        <div className="card-right">
          {childComponent}
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  heading: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string.isRequired,
  childComponent: PropTypes.element.isRequired,
  headingIcon: PropTypes.string.isRequired,
};

export default Card;
