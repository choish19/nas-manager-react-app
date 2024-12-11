import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatDate = (dateString: string, type: 'full' | 'relative' = 'full'): string => {
  const date = new Date(dateString);
  
  if (type === 'relative') {
    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  }
  
  return format(date, 'yyyy-MM-dd HH:mm', { locale: ko });
};