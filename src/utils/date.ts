export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let dayString: string;
  if (days === 0) {
    dayString = 'Сегодня';
  } else if (days === 1) {
    dayString = 'Вчера';
  } else if (days < 5) {
    dayString = `${days} дня назад`;
  } else {
    dayString = `${days} дней назад`;
  }

  const timeString = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${dayString}, ${timeString}`;
};
