export function formatDateTime(timeStamp: number) {
  const date = new Date(timeStamp);
  return (
    [
      date.getFullYear(),
      padZero(date.getMonth() + 1),
      padZero(date.getDate()),
    ].join('/') +
    ' ' +
    [padZero(date.getHours()), padZero(date.getMinutes())].join(':')
  );
}

function padZero(n: number): string {
  return String(n).padStart(2, '0');
}

export function formatDuration(duration: number) {
  if (duration <= 0) {
    return '0秒';
  }

  let seconds = (duration / 1000) | 0;

  const hours = (seconds / (60 * 60)) | 0;
  seconds %= 60 * 60;

  const minutes = (seconds / 60) | 0;

  return (
    `${hours > 0 ? `${hours}時間` : ''}${minutes > 0 ? `${minutes}分` : ''}` ||
    `${seconds}秒`
  );
}
