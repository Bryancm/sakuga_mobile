import { formatDateForSearch, getWeekDate, getMonthDate, getYearDate } from './date';

const currentDate = new Date();
const today = formatDateForSearch(currentDate);

const { firstDayWeek, lastDayWeek } = getWeekDate(currentDate);
const { firstDayMonth, lastDayMonth } = getMonthDate(currentDate);
const { firstDayYear } = getYearDate(currentDate.getFullYear());

export const exploreData = [
  {
    id: '0',
    title: "Day's popular",
    menuType: 'date',
    search: `date:${today} order:score`,
    date: currentDate,
    loaded: false,
  },
  { id: '1', title: 'New Artist', menuType: 'tag', type: '1', order: 'date', loaded: false },
  {
    id: '2',
    title: "Week's Popular",
    menuType: 'week',
    search: `date:${formatDateForSearch(firstDayWeek)}...${formatDateForSearch(lastDayWeek)} order:score`,
    date: firstDayWeek,
    secondDate: lastDayWeek,
    loaded: false,
  },
  { id: '3', title: 'Character Acting', menuType: 'post', search: 'character_acting', loaded: false },
  { id: '4', title: 'New Copyright', menuType: 'tag', type: '3', order: 'date', loaded: false },
  {
    id: '5',
    title: "Month's Popular",
    menuType: 'month',
    search: `date:${formatDateForSearch(firstDayMonth)}...${formatDateForSearch(lastDayMonth)} order:score`,
    date: firstDayMonth,
    secondDate: lastDayMonth,
    loaded: false,
  },
  { id: '6', title: 'Fighting', menuType: 'post', search: 'fighting', loaded: false },
  { id: '7', title: 'Popular Artist', menuType: 'tag', type: '1', order: 'count', loaded: false },
  { id: '8', title: 'Liquid', menuType: 'post', search: 'liquid', loaded: false },
  { id: '9', title: 'Explosions', menuType: 'post', search: 'explosions', loaded: false },
  { id: '10', title: 'Popular Copyright', menuType: 'tag', type: '3', order: 'count', loaded: false },
  { id: '11', title: 'Hair', menuType: 'post', search: 'hair', loaded: false },
  { id: '12', title: 'Production Materials', menuType: 'post', search: 'production_materials', loaded: false },
  {
    id: '13',
    title: "Year's Popular",
    menuType: 'year',
    search: `date:${formatDateForSearch(firstDayYear)}...${today} order:score`,
    date: currentDate,
    secondDate: firstDayYear,
    loaded: false,
  },
];
