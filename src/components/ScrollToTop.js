import { FormUp } from 'grommet-icons';
import React from 'react';
import styled from 'styled-components';

import { breakpoint } from '../shared/react-pure/size';
import useIsMobile from '../shared/react/hooks/useIsMobile';

const Wrapper = styled.div`
  position: fixed;
  bottom: 3rem;
  right: ${({ right }) => right};
`;

function ScrollToTop() {
  const isMobile = useIsMobile();

  return (
    <Wrapper right={isMobile ? '2rem' : `calc(50vw - ${breakpoint / 2}px)`}>
      <FormUp
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }}
      />
    </Wrapper>
  );
}

export default ScrollToTop;
