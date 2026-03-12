import dayjs,{type ConfigType } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function formatPostTime(isoTime : ConfigType ) {
  const time = dayjs(isoTime);

  return time.diff(dayjs(), "day") < -1
    ? time.format("DD MMM")
    : time.fromNow();
}
