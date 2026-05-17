export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral',
}

export interface ICreateLeadRequest {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
}

export interface IUpdateLeadRequest {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
}

export interface ILeadResponse {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
