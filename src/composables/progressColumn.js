import { reactive, computed } from 'vue'
import { format, subMonths, subDays, startOfWeek, addDays, addMonths, endOfMonth, nextMonday, nextSunday, previousMonday, previousSunday, isAfter, isEqual } from 'date-fns';

export function useProgressCol() {
  const week = ['(日)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)'];
  const nowMonth = new Date().getMonth();
  const nowYear = new Date().getFullYear();

  const paySwitchList = reactive({
    options: [
      {
        name: '日統計',
        value: '0'
      },
      {
        name: '週統計',
        value: '1'
      },
      {
        name: '月統計',
        value: '2'
      }
    ],
    category: '0'
  });
  const dates = reactive({ data: [new Date(), new Date()] });

  const statisticsDate = computed(() => formatDate(dates.data, paySwitchList.category));

  const minDate = computed(() => subMonths(new Date(nowYear, nowMonth, 1, 23, 59, 59), 3));

  const today = computed(() => new Date(format(new Date(), 'yyyy/MM/dd')));

  const calculateDate = (date, type, index) => {
    const month = date.getMonth();
    const year = date.getFullYear();

    if (paySwitchList.category === '0') {
      return dayCalc(date, type);
    } else if (paySwitchList.category === '1') {
      return weekCalc(date, type, index);
    }

    return monthCalc(new Date(year, month, 1), type, index);
  };

  const dayCalc = (date, type) => (type === 'add' ? addDays(date, 1) : subDays(date, 1));

  const weekCalc = (date, type, index) => {
    if (type === 'add') {
      if (!isAfter(today.value, nextSunday(date)) && index) {
        return today.value;
      }
      if (!isAfter(today.value, nextMonday(date)) && !index) {
        return today.value;
      }
      return index ? nextSunday(date) : nextMonday(date);
    }

    if (!isAfter(previousSunday(date), minDate.value) && index) {
      return minDate.value;
    }

    if (!isAfter(previousMonday(date), minDate.value) && !index) {
      return minDate.value;
    }

    return index ? previousSunday(date) : previousMonday(date);
  };

  const monthCalc = (date, type, index) => {
    if (type === 'add') {
      let lastDay = endOfMonth(addMonths(date, 1));
      if (!isAfter(today.value, lastDay)) {
        lastDay = today.value;
      }
      return index ? lastDay : addMonths(date, 1);
    }
    const lastDay = endOfMonth(subMonths(date, 1));
    return index ? lastDay : subMonths(date, 1);
  };

  const formatDate = (dates, type = '0') => {
    const today = dates[0];

    if (type === '0') {
      return `${format(today, 'yyyy/MM/dd')} ${week[today.getDay()]}`;
    }

    return `${format(today, 'yyyy/MM/dd')} ${week[today.getDay()]} ~ ${format(new Date(dates[1]), 'yyyy/MM/dd')} ${week[new Date(dates[1]).getDay()]}`;
  };

  const compareDates = (type) => {
    if (type === 'prev') {
      return isAfter(dates.data[0], minDate.value) && !isEqual(dates.data[0], minDate.value);
    }

    return isAfter(today.value, dates.data[1]) && !isEqual(today.value, dates.data[1]);
  };

  const resetDate = () => {
    if (paySwitchList.category === '0') {
      return today.value;
    }
  
    if (paySwitchList.category === '1') {
      return startOfWeek(new Date(today.value), { weekStartsOn: 1 });
    }
  
    return new Date(nowYear, nowMonth, 1);
  };

  return {
    paySwitchList,
    dates,
    nowYear,
    nowMonth,
    today,
    statisticsDate,
    calculateDate,
    formatDate,
    compareDates,
    resetDate
  }
}