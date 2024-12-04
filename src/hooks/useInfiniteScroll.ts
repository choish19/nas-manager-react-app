import { useEffect, useCallback, useRef } from 'react';
import { PageRequest } from '../types';

export const useInfiniteScroll = (
  fetchMore: (pageRequest: PageRequest) => void,
  hasMore: boolean,
  loading: boolean,
  pageRequest: PageRequest
) => {
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  const pageRequestRef = useRef(pageRequest);

  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
    pageRequestRef.current = pageRequest;
  }, [loading, hasMore, pageRequest]);

  const handleScroll = useCallback(() => {
    if (loadingRef.current || !hasMoreRef.current) return;

    const container = document.querySelector('.scrollbar-stable');
    if (!container) return;

    const { scrollHeight, scrollTop, clientHeight } = container;
    const threshold = scrollHeight * 0.8;

    if (scrollTop + clientHeight >= threshold) {
      fetchMore({
        ...pageRequestRef.current,
        page: pageRequestRef.current.page + 1,
      });
    }
  }, [fetchMore]);

  useEffect(() => {
    const container = document.querySelector('.scrollbar-stable');
    if (!container) return;

    const throttledScroll = throttle(handleScroll, 200);
    container.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', throttledScroll);
    };
  }, [handleScroll]);
};

function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return (...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}