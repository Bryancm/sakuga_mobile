import RelativeTimeFormat from 'relative-time-format';
import en from 'relative-time-format/locale/en.json';

const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

RelativeTimeFormat.addLocale(en);
const rtf = new RelativeTimeFormat('en', { numeric: 'auto', style: 'short' });

export const getRelativeTime = (d1, d2 = new Date()) => {
  var elapsed = d1 - d2;

  // "Math.abs" accounts for both "past" & "future" scenarios
  for (var u in units)
    if (Math.abs(elapsed) > units[u] || u == 'second')
      return rtf.format(Math.round(elapsed / units[u]), u).replace('.', '');
};

export const formatDate = (date) => {
  const d = new Date(date * 1000);
  // const ye = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(d);
  // const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  // const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  const ye = d.getFullYear().toString().slice(2);
  const mo = d.getMonth();
  const da = d.getDay();
  return `${da}-${mo}-${ye}`;
};

export const formatDateForSearch = (date) => {
  const d = new Date(date);
  // const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  // const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  // const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  const ye = d.getFullYear().toString();
  const mo = d.getMonth();
  const da = d.getDay();
  return `${ye}-${mo}-${da}`;
};

export const getYesterdayDate = (date = new Date()) => {
  const newDate = new Date(date);
  return new Date(newDate.setDate(newDate.getDate() - 1));
};

export const getTomorrowDate = (date = new Date()) => {
  const newDate = new Date(date);
  return new Date(newDate.setDate(newDate.getDate() + 1));
};

export const getWeekDate = (date = new Date()) => {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const first = newDate.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  // const first = new Date(newDate.setDate(diff));
  // const first = newDate.getDate() - newDate.getDay(); // First day is the day of the month - the day of the week
  const last = first + 6; // last day is the first day + 6
  const firstDayWeek = new Date(newDate.setDate(first));
  const lastDayWeek = new Date(new Date(date).setDate(last));
  return { firstDayWeek, lastDayWeek };
};

export const getMonthDate = (date = new Date()) => {
  const firstDayMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { firstDayMonth, lastDayMonth };
};

export const getYearDate = (year) => {
  const firstDayYear = new Date(year, 0, 1);
  const lastDayYear = new Date(year, 11, 31);
  return { firstDayYear, lastDayYear };
};
