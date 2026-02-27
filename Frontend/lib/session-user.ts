export type SessionUserProfile = {
  display_name: string;
  bio: string;
  avatar_url: string;
  website: string;
  location: string;
};

export type SessionUser = {
  id: number;
  username: string;
  email: string;
  profile: SessionUserProfile;
};
