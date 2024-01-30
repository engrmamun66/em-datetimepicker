export function checkType(value) {
  const type = typeof value;

  if (type === 'symbol') {
    return 'symbol';
  } else if (type === 'object') {
    if (value === null) {
      return 'null';
    } else if (Array.isArray(value)) {
      return 'array';
    } else if (value instanceof RegExp) {
      return 'regexp';
    } else if (value instanceof HTMLElement) {
      return 'domElement';
    } else if (value instanceof Date) {
      return 'date';
    } else {
      return 'object';
    }
  } else {
    return type; // undefined, function, boolean
  }
}

export function isValidAvailableData(availableInDates){
  try {
    let type = checkType(availableInDates);
    if(!availableInDates) return null;
    if(type === 'array' && availableInDates?.length && availableInDates?.every(item => item.available && item.date)){
        availableInDates;
        return availableInDates;
    } else if(
        type === 'object' 
        && availableInDates?.aiasesKey?.date
        && availableInDates?.aiasesKey?.available 
        && availableInDates.data?.length
        ) {
            let _available = JSON.parse(JSON.stringify(availableInDates));
            _available.data.map(item => {
                item['date'] = item?.[availableInDates?.aiasesKey?.date] ?? item?.date;
                item['available'] = item?.[availableInDates?.aiasesKey?.available] ?? item?.available;
                return item;
            })
            return _available.data;
    } else {
        return null;
    }
  } catch (error) {
    
  }
}

export function isAvailableByDate(availableInDates, makeDate/**fn*/, {date}){
  let dates = isValidAvailableData(availableInDates);
  if(!dates?.length) return false;
  let exact_date = dates.filter(item => makeDate(item.date) == date)?.[0];
  return exact_date;
}
