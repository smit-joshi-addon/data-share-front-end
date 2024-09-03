import { RequestType } from "./request-type.model";


export interface DataDetailDTO {
  detailId: number;
  masterId: number;
  secret: string;
  validTill: string;
  createdAt: string;
  createdById: string;
  createdByName: string;
  createdByIp: string;
  status: boolean;
  type: RequestType;
}
