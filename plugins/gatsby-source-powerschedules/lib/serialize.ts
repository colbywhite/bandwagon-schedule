import type {ScheduleResponse} from '../../@types';
import superjson from 'superjson';

export interface SerializedScheduleResponse extends String {
}

export function serialize(schedule: ScheduleResponse): SerializedScheduleResponse {
  return superjson.stringify(schedule);
}

export function deserialize(schedule: SerializedScheduleResponse): ScheduleResponse {
  return superjson.parse<ScheduleResponse>(schedule as string);
}
