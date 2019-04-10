
export interface ISettings {
  claimStatuses: any[];
}

export interface DashboardState {
  claims?: any;
  claimDetail: any;
  caseMessages: any[];
  caseDetail: any;
  loading: boolean;
  modalWindow: string|null;
  modalImageSrc: string|null;
  settings: ISettings;
}
