export interface Project {
  id: string;
  name: string;
  description: string;
  matchType: {
    name: boolean;
    description: boolean;
    techs: boolean;
  };
  techs: Tech[];
}

export interface Tech {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
}

export interface Member {
  id: string;
  user: User;
  roleName: string;
  project: Project;
}
