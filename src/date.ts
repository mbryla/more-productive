const toString = (date: Date) => date.toISOString().substring(0, 10);

export const currentYearMonth = () => new Date().toISOString().substring(0, 8);

export const monthBoundaries = ({ year, month }: { year: string; month: string }) => {
  const lastDay = new Date(Number(year), Number(month), 0); // JS ¯\_(ツ)_/¯

  return {
    firstDay: `${year}-${month}-01`,
    lastDay: toString(lastDay),
  };
};

export const monthDates = ({ year, month }: { year: string; month: string }) => {
  const { firstDay, lastDay } = monthBoundaries({ year, month });
  const dates = [firstDay];

  const date = new Date(firstDay);
  while (toString(date) <= lastDay) {
    date.setDate(date.getDate() + 1);
    dates.push(toString(date));
  }

  return dates;
};

export type Day = ReturnType<typeof mapDay>;

export const mapDay = (date: string) => {
  const day = new Date(date).getDay();

  switch (day) {
    case 0:
      return 'Sun';

    case 1:
      return 'Mon';

    case 2:
      return 'Tue';

    case 3:
      return 'Wed';

    case 4:
      return 'Thu';

    case 5:
      return 'Fri';

    case 6:
      return 'Sat';
    default:
      return 'Sun';
  }
};

export const isWorkday = (day: Day) => !(day === 'Sat' || day === 'Sun');

export const formatMinutes = (timeMinutes: number) => {
  const hours = Math.floor(timeMinutes / 60);
  const minutes = timeMinutes - hours * 60;
  return `${hours}h ${minutes}m`;
};
