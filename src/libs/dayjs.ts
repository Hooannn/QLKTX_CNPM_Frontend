import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import "dayjs/locale/en";
import weekday from "dayjs/plugin/weekday";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(weekday);

export const setLocale = (locale: "vi" | "en" | null) => {
  return dayjs.locale(locale as string);
};
export default dayjs;
