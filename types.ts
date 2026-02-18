export enum SprintStatus {
  DONE = 'Done',
  DELIVERED = 'Delivered',
  UAT = 'UAT',
  IAT = 'IAT',
  DEV_CONFIG = 'Dev/Config',
  ANALYSIS = 'Analysis'
}

export interface SprintItem {
  id: number;
  issueKey: string;
  summary: string;
  status: SprintStatus | string;
  goLiveDate?: string;
}

export interface SprintMetrics {
  sprintName: string;
  startDate: string;
  endDate: string;
  averageDeliveryRate: number;
}

export interface SprintSection {
  metrics: SprintMetrics;
  items: SprintItem[];
}

export interface ReportData {
  sprint1: SprintSection;
  sprint2: SprintSection;
  deprioritized: { id: number; summary: string; issueKey: string; status: string }[];
}
