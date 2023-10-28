import { Anchor, Box } from 'grommet';
import React from 'react';
import { useLocation } from 'wouter';

function NavBar({ isLoggedIn, tried }) {
  const [location, setLocation] = useLocation();

  if (!isLoggedIn || !tried) {
    return null;
  }

  return (
    <Box direction="row" justify="center" pad="1rem 0 0">
      <Anchor
        label="Home"
        color={location === '/' ? 'brand' : 'text'}
        onClick={() => {
          setLocation('/');
        }}
        margin="0 1rem 0 0"
      />
      <Anchor
        label="On this day"
        color={location.startsWith('/on-this-day') ? 'brand' : 'text'}
        onClick={() => {
          setLocation('/on-this-day?index=0');
        }}
        margin="0 1rem 0 0"
      />
      <Anchor
        label="Files"
        color={location.startsWith('/files') ? 'brand' : 'text'}
        onClick={() => {
          setLocation('/files');
        }}
      />
    </Box>
  );
}

export default NavBar;
