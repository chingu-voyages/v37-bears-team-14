export interface GithubProfilePhotos {
  value: string;
}

export interface GithubProfile {
  photos: GithubProfilePhotos[];
}

export const parseAvatarUrl = (profile: GithubProfile): string | null => {
  for (const photo of profile.photos) {
    return photo.value;
  }
  return null;
};
