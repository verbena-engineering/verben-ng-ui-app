export enum ObjectState {
  New = 'New',
  Changed = 'Changed',
  Unchanged = 'Unchanged',
  Removed = 'Removed',
}

export interface BaseModel {
  id: string | number;
  Id: string;
  Code: string;
  TenantId: string;
  ServiceName: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  DataState: ObjectState;
  readonly Error?: string;
}

export interface OperationAccount extends BaseModel {
  AccountGroup: string;
  Description: string;
  ShadowAccount: string;
  Tags: string;
  Name: string;
  Currency: string;
  ParentGroupPath: string;
  //   RefAccountGroup?: AccountGroup;
  AccountGroupName: string;
  MainAccountCode: string;
  MainAccountName: string;
  LedgerSubsidiary: string;
  Identity: string;
  //   Status: FinancialStatus;
  Balance: number;
  Company: string;
}
