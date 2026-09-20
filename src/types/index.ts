export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  college: string;
  course: string;
  year: string;
  bio?: string;
  skills: string[];
  interests: string[];
  profileImage?: string;
  projects?: string[] | Project[];
  role: 'student' | 'admin';
  createdAt?: string;
}

export interface Project {
  _id: string;
  id?: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  teamSize: number;
  members: (User | string)[];
  owner: User | string;
  deadline: string;
  status: 'Open' | 'In Progress' | 'Completed';
  createdAt: string;
}

export interface TeamRequest {
  _id: string;
  id?: string;
  student: User;
  project: Project;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
