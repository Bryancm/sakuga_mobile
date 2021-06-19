import { formatDateForSearch, getWeekDate, getMonthDate, getYearDate } from './date';

const currentDate = new Date();
const today = formatDateForSearch(currentDate);

const { firstDayWeek, lastDayWeek } = getWeekDate(currentDate);
const { firstDayMonth, lastDayMonth } = getMonthDate(currentDate);
const { firstDayYear } = getYearDate(currentDate.getFullYear());

export const exploreData = [
  { id: '1', title: "Day's popular", menuType: 'date', search: `date:${today} order:score`, date: currentDate },
  { id: '2', title: 'New Artist', menuType: 'tag', type: '1', order: 'date' },
  {
    id: '3',
    title: "Week's Popular",
    menuType: 'week',
    search: `date:${formatDateForSearch(firstDayWeek)}...${formatDateForSearch(lastDayWeek)} order:score`,
    date: firstDayWeek,
    secondDate: lastDayWeek,
  },
  { id: '4', title: 'Character Acting', menuType: 'post', search: 'character_acting' },
  { id: '5', title: 'New Copyright', menuType: 'tag', type: '3', order: 'date' },
  {
    id: '6',
    title: "Month's Popular",
    menuType: 'month',
    search: `date:${formatDateForSearch(firstDayMonth)}...${formatDateForSearch(lastDayMonth)} order:score`,
    date: firstDayMonth,
    secondDate: lastDayMonth,
  },
  { id: '7', title: 'Fighting', menuType: 'post', search: 'fighting' },
  { id: '8', title: 'Popular Artist', menuType: 'tag', type: '1', order: 'count' },
  { id: '9', title: 'Liquid', menuType: 'post', search: 'liquid' },
  { id: '10', title: 'Explosions', menuType: 'post', search: 'explosions' },
  { id: '11', title: 'Popular Copyright', menuType: 'tag', type: '3', order: 'count' },
  { id: '12', title: 'Hair', menuType: 'post', search: 'hair' },
  { id: '13', title: 'Production Materials', menuType: 'post', search: 'production_materials' },
  {
    id: '14',
    title: "Year's Popular",
    menuType: 'year',
    search: `date:${formatDateForSearch(firstDayYear)}...${today} order:score`,
    date: currentDate,
    secondDate: firstDayYear,
  },
];
