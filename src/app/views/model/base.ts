import { ObjectState } from "./objects-state";

export interface BaseModel {
  id: string | number;

  Id: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  State: ObjectState;
  Tenant: string;
  readonly Error?: string;
}
