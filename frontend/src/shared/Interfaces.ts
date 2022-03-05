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
  settingOpenRoles: string[];
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

export interface Application {
  id: string;
  createdAt: Date;
  project: {
    id: string;
    name: string;
    description: string;
  };
  user: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  status: string;
  content: string | null;
  requestedRole: string | null;
}
