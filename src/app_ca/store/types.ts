import { UserState } from './user/types';
import { DashboardState } from './dashboard/types';

export interface RootState {
  user: UserState;
  dashboard: DashboardState;
}
