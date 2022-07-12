import { EOL } from 'os';

import { Api } from '../api/api';
import { Config } from '../config';
import { currentYearMonth, isWorkday } from '../date';

export const createFixCommand = (config: Config, api: Api) => async (yearAndMonth?: string) => {
  const [year, month] = (yearAndMonth ?? currentYearMonth()).split('-');
  const { rawEntries, regularTimeEntries, overtimeEntries, undertimeEntries } = await api.getParsedTimeEntries({
    year,
    month,
  });

  const emptyUndertimesEntries = undertimeEntries.filter((entry) => entry.totalTimeMinutes === 0);
  const workingDaysCount = rawEntries.filter((entry) => isWorkday(entry.day)).length;

  console.log(`= fixing ${year}-${month}`);
  console.log(`total days: ${rawEntries.length} (${workingDaysCount} working days)`);
  console.log(`   ok time: ${regularTimeEntries.length} `);
  if (overtimeEntries.length) {
    console.log(`  overtime: ${overtimeEntries.length}`);
  }

  if (undertimeEntries.length) {
    console.log(
      ` undertime: ${undertimeEntries.length}${
        emptyUndertimesEntries.length > 0 ? ` (can fix:  ${emptyUndertimesEntries.length} days)` : ''
      }`
    );
  }

  if (emptyUndertimesEntries.length) {
    console.log(`${EOL}attempting to create entries for ${emptyUndertimesEntries.length} days`);
  }

  const responses = await Promise.allSettled(
    emptyUndertimesEntries.map((entry) => api.createTimeEntry({ date: entry.date }))
  );

  const successfulResponses = responses.filter((response) => response.status === 'fulfilled');
  const unsuccessfulResponsesCount = responses.length - successfulResponses.length;

  if (successfulResponses.length > 0) {
    console.log(`- successfully created entries for ${successfulResponses.length} days`);
  }

  if (unsuccessfulResponsesCount > 0) {
    console.log(`- failed to create entries for ${unsuccessfulResponsesCount} days - please try again`);
  }

  if (regularTimeEntries.length + overtimeEntries.length + successfulResponses.length === workingDaysCount) {
    console.log(`${EOL}= looks good, please check status!`);
  } else {
    console.log(`${EOL}= not everyting ok, please check status`);
  }
};
