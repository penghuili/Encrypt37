import useIsMobile from '../shared/react/hooks/useIsMobile';

export function useXMargin() {
  const isMobile = useIsMobile();

  return isMobile ? '0 1rem' : '0';
}
