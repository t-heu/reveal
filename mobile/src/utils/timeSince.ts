import moment from 'moment';
import {tz} from 'moment-timezone';

export default function timeSince(date: number) {
  return moment(date).tz(tz.guess()).fromNow();
}
