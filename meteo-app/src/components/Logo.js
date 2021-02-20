import React from 'react';

const Logo = (props) => {
  return (
    <img
      alt="Logo"
      src="/static/icons/weather.svg"
      {...props}
    />
  );
};

export default Logo;
