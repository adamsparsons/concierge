import React from 'react';

const ScrollLink = ({ name, label, onShowSection }) => {
  return <li><a href='#' onClick={() => onShowSection(name + '-states')}>{label}</a></li>;
};

const ScrollLinks = ({ visible, links, onShowSection }) => {
  if( !visible.length ) {
    return <span />;
  }
  return(
      <ul>
        <li key="top"><a href="#header">Top</a></li>
        {visible.map( k => <ScrollLink key={k} onShowSection={onShowSection} {...links[k]} /> )}
      </ul>
    );
};

module.exports = ScrollLinks;