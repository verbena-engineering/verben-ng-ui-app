export interface ExampleDataType {
  id: string;
  activityDetails: { firstName: string; lastName: string }[];
  numberOfParticipants: number;
  role?: string;
  age?: number;
  money?: number;
  message?: string;
  names?: { firstName: string; lastName: string };
}
