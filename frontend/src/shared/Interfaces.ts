export interface Project {
  id: string;
  name: string;
  description: string;
  techs: Tech[];
  members: Member[];
  settingOpenRoles: string[];
}

export interface ProjectResult {
  id: string;
  name: string;
  description: string;
  matchType: {
    name: boolean;
    description: boolean;
    techs: boolean;
  };
  members: Member[];
  techs: Tech[];
  settingOpenRoles: string[];
}

export interface Comment {
  id: string;
  project: string;
  user: User;
  depth: number;
  children: any[];
  commentText: string;
  likes: string[];
  likess?: string[];
  dislikes: string[];
  dislikess?: string[];
  deleted: boolean;
  parentId: string | null;
  postedDate: Date;
  updatedAt: string;
}

export interface CommentData {
  count: number;
  comments: Comment[];
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
  displayName: string;
  techs: Tech[];
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
  updatedAt: Date;
  project: {
    id: string;
    name: string;
    description: string;
    settingOpenRoles: string[];
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

export interface Hook {
  id: string;
  project: string;
  secret: string;
  secretGeneratedAt: Date;
  isActive: boolean;
  invokedAt: Date | null;
  invokeCount: number;
}
