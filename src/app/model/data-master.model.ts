// src/app/models/data-master.model.ts

import { RequestType } from "./request-type.model";



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
