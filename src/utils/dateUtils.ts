import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'yyyy-MM-dd HH:mm', { locale: ko });
};