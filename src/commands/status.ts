import { time } from 'console';
import { EOL } from 'os';

import { Api } from '../api/api';
import { Config } from '../config';
import { currentYearMonth, formatMinutes, isWorkday } from '../date';

export const createStatusCommand =
  (config: Config, api: Api) =>
  async ({ yearAndMonth, verbose }: { yearAndMonth?: string; verbose: boolean }) => {
    const [year, month] = (yearAndMonth ?? currentYearMonth()).split('-');
    const { rawEntries, regularTimeEntries, overtimeEntries, undertimeEntries } = await api.getParsedTimeEntries({
      year,
      month,
    });

    const emptyUndertimesEntries = undertimeEntries.filter((entry) => entry.totalTimeMinutes === 0);
    const workingDaysCount = rawEntries.filter((entry) => isWorkday(entry.day)).length;

    console.log(`= status ${year}-${month}`);
    console.log(`total days: ${rawEntries.length} (${workingDaysCount} working days)`);

    const okTimeStatus = `   ok time: ${regularTimeEntries.length + overtimeEntries.length}`;
    const overtimeStatus = ` (overtime: ${overtimeEntries.length})`;
    console.log(`${okTimeStatus}${overtimeEntries.length > 0 ? overtimeStatus : ''}`);

    const undertimeStatus = ` undertime: ${undertimeEntries.length}`;
    const fixableStatus = ` (can fix: ${emptyUndertimesEntries.length})`;
    console.log(`${undertimeStatus}${emptyUndertimesEntries.length > 0 ? fixableStatus : ''}`);

    if (verbose) {
      console.log(`${EOL}= DAILY DETAILS`);

      rawEntries.forEach((entry) => {
        const time = ` - ${formatMinutes(entry.totalTimeMinutes)}`;
        const isUndertime = isWorkday(entry.day) && entry.totalTimeMinutes < 480;
        const isOvertime =
          (isWorkday(entry.day) && entry.totalTimeMinutes > 480) ||
          (!isWorkday(entry.day) && entry.totalTimeMinutes > 0);

        console.log(
          `${entry.date} - ${entry.day}${entry.totalTimeMinutes > 0 ? time : ' - no entry'}${
            isOvertime ? ' (OVERTIME)' : ''
          }${isUndertime ? ' (UNDERTIME)' : ''}`
        );

        if (entry.day === 'Fri' || entry.day === 'Sun') {
          console.log();
        }
      });
    }
  };
