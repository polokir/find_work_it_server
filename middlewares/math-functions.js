



 function calculateMedian(arr) {
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 === 0 ? (arr[mid - 1] + arr[mid]) / 2 : arr[mid];
}

 function dateParser(dateString) {
  const [day, month, year] = dateString.split("-");
  const formattedDateString = `${year}-${month}-${day}T00:00:00.000Z`;
  return new Date(formattedDateString);
}

function monthIndexToName(index) {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[index];
  }

  function groupBy(array, keyFn) {
    return array.reduce((result, item) => {
      const key = keyFn(item);
      (result[key] = result[key] || []).push(item);
      return result;
    }, {});
  }

module.exports = {calculateMedian,dateParser,monthIndexToName,groupBy}