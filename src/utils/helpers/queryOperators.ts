import { LessThan, MoreThan } from 'typeorm';

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const dateOfMonth = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  const milliseconds = date.getMilliseconds();

  return `${year}-${month}-${dateOfMonth} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

export const moreThanDate = (date: Date) => MoreThan(formatDate(date));
export const lessThanDate = (date: Date) => LessThan(formatDate(date));
