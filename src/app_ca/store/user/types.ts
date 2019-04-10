
export interface Profile {
  email: string;
  first_name: string;
}

export interface UserState {
  profile?: Profile;
  loading: boolean;
}
