import { useEffect, useCallback, useRef } from 'react';
import { PageRequest } from '../types';

export const useInfiniteScroll = (
  fetchMore: () => Promise<void>,
  hasMore: boolean,
  loading: boolean,
  pageRequest: PageRequest
) => {
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  const handleScroll = useCallback(() => {
    if (loadingRef.current || !hasMoreRef.current) return;

    const scrollingElement = document.querySelector('.scrollbar-stable');
    if (!scrollingElement) return;

    const { scrollTop, clientHeight, scrollHeight } = scrollingElement;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Trigger fetch when user has scrolled 70% of the content
    if (scrollPercentage > 0.7) {
      fetchMore();
    }
  }, [fetchMore]);

  useEffect(() => {
    const scrollingElement = document.querySelector('.scrollbar-stable');
    if (!scrollingElement) return;

    const throttledScroll = throttle(handleScroll, 200);
    scrollingElement.addEventListener('scroll', throttledScroll);

    // Initial check in case the content doesn't fill the page
    handleScroll();

    return () => {
      scrollingElement.removeEventListener('scroll', throttledScroll);
    };
  }, [handleScroll]);
};

function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return function(...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}