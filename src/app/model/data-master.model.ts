// src/app/models/data-master.model.ts

export enum RequestType {
  PULL = 'PULL',
  PUSH = 'PUSH',
  BOTH = 'BOTH'
}

export interface DataMaster {
  sharingId?: number;
  businessId: number;
  secret?: string;
  createdById?: string;
  createdByIp?: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  type: RequestType;
}
