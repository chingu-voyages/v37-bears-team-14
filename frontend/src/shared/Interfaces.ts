export interface Project {
  id: string;
  name: string;
  description: string;
  techs: Tech[];
}

export interface Tech {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}
