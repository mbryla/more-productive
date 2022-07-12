import axios from 'axios';
import { Config, Headers } from '../config';
import { Day, isWorkday, mapDay, monthBoundaries, monthDates } from '../date';

interface CurrentUserResponse {
  data: Array<{
    id: string;
    attributes: {
      date: string;
      time: number;
    };
  }>;
}

export interface TimeEntry {
  id: string;
  date: string;
  timeMinutes: number;
}

export const getTimeEntries =
  (config: Config, headers: Headers) =>
  async ({ year, month }: { year: string; month: string }): Promise<Array<TimeEntry>> => {
    const { firstDay, lastDay } = monthBoundaries({ year, month });
    const url = `${config.baseUrl}/time_entries`;

    const data = (
      await axios.get<CurrentUserResponse>(url, {
        headers,
        params: {
          'filter[person_id][contains]': config.userId,
          'filter[after]': firstDay,
          'filter[before]': lastDay,
        },
      })
    ).data.data;

    return data.map((timeEntry) => ({
      id: timeEntry.id,
      date: timeEntry.attributes.date,
      timeMinutes: timeEntry.attributes.time,
    }));
  };

export interface ParsedTimeEntry {
  date: string;
  day: Day;
  entries: number;
  totalTimeMinutes: number;
}

const regularTimeFilter = (entry: ParsedTimeEntry) => isWorkday(entry.day) && entry.totalTimeMinutes === 480;

const undertimeFilter = (entry: ParsedTimeEntry) => isWorkday(entry.day) && entry.totalTimeMinutes < 480;

const overtimeFilter = (entry: ParsedTimeEntry) =>
  (isWorkday(entry.day) && entry.totalTimeMinutes > 480) || (!isWorkday(entry.day) && entry.totalTimeMinutes > 0);

export const mapEntriesToDates = (timeEntries: Array<TimeEntry>, dates: Array<string>) =>
  dates.map((date) => {
    const entries = timeEntries.filter((timeEntry) => timeEntry.date === date);
    const totalTimeMinutes = entries.reduce((totalTimeMinutes, entry) => totalTimeMinutes + entry.timeMinutes, 0);

    return {
      day: mapDay(date) as Day,
      date,
      entries: entries.length,
      totalTimeMinutes,
    };
  });

interface ParsedTimeEntries {
  rawEntries: Array<ParsedTimeEntry>;
  regularTimeEntries: Array<ParsedTimeEntry>;
  overtimeEntries: Array<ParsedTimeEntry>;
  undertimeEntries: Array<ParsedTimeEntry>;
}

export const getParsedTimeEntries =
  (config: Config, headers: Headers) =>
  async ({ year, month }: { year: string; month: string }): Promise<ParsedTimeEntries> => {
    const timeEntries = await getTimeEntries(config, headers)({ year, month });
    const dates = monthDates({ year, month });

    const rawEntries = mapEntriesToDates(timeEntries, dates);

    return {
      rawEntries,
      regularTimeEntries: rawEntries.filter(regularTimeFilter),
      overtimeEntries: rawEntries.filter(overtimeFilter),
      undertimeEntries: rawEntries.filter(undertimeFilter),
    };
  };
