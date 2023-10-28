import useIsMobileSize from '../shared/react/hooks/useIsMobileSize';

export function useXMargin() {
  const isMobile = useIsMobileSize();

  return isMobile ? '0 1rem' : '0';
}
