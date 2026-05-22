const MS = {
  minute: 60_000,
  hour: 3_600_000,
  day: 86_400_000,
  week: 604_800_000,
  month: 2_592_000_000,
  year: 31_536_000_000,
};

export function timeAgo(date) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const diff = Date.now() - d.getTime();
  if (diff < MS.minute) return 'just now';
  if (diff < MS.hour) {
    const m = Math.floor(diff / MS.minute);
    return `${m} minute${m === 1 ? '' : 's'} ago`;
  }
  if (diff < MS.day) {
    const h = Math.floor(diff / MS.hour);
    return `${h} hour${h === 1 ? '' : 's'} ago`;
  }
  if (diff < MS.week) {
    const days = Math.floor(diff / MS.day);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  if (diff < MS.month) {
    const w = Math.floor(diff / MS.week);
    return `${w} week${w === 1 ? '' : 's'} ago`;
  }
  if (diff < MS.year) {
    const mo = Math.floor(diff / MS.month);
    return `${mo} month${mo === 1 ? '' : 's'} ago`;
  }
  const y = Math.floor(diff / MS.year);
  return `${y} year${y === 1 ? '' : 's'} ago`;
}

export function isSameDay(a, b) {
  if (!a || !b) return false;
  const x = new Date(a);
  const y = new Date(b);
  return (
    x.getFullYear() === y.getFullYear() &&
    x.getMonth() === y.getMonth() &&
    x.getDate() === y.getDate()
  );
}

export function isToday(date) {
  return isSameDay(date, new Date());
}

export function isOverdue(date) {
  if (!date) return false;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  return target.getTime() < today.getTime();
}

const FOLLOWUP_TIME_FMT = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
});

const FOLLOWUP_FULL_FMT = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export function formatFollowUp(date) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  if (isToday(d)) return `Today at ${FOLLOWUP_TIME_FMT.format(d)}`;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(d, tomorrow)) return `Tomorrow at ${FOLLOWUP_TIME_FMT.format(d)}`;
  return FOLLOWUP_FULL_FMT.format(d);
}

const FULL_TIME_FMT = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export function formatTimestamp(date) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return FULL_TIME_FMT.format(d);
}

export function toDatetimeLocalValue(date) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
