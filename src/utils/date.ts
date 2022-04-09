const formatDate = (dateTimestamp: number) => {
  const d = new Date(dateTimestamp);
  const month = `${d.getMonth() + 1}`;
  const day = `${d.getDate()}`;
  const year = `${d.getFullYear()}`;

  const newMonth = month.length < 2 ? `0${month}` : month;
  const newDay = day.length < 2 ? `0${day}` : day;

  return [year, newMonth, newDay].join('-');
};

export { formatDate };
