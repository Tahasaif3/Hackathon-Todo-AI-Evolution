export interface Task {
  id: number;
  user_id: string;
  project_id?: string;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string;
  created_at: string;
  updated_at: string;
  is_ai_generated: boolean;
}

export interface TaskCreate {
  title: string;
  description?: string;
  completed?: boolean;
  project_id?: string;
  due_date?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  project_id?: string;
  due_date?: string;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  offset: number;
  limit: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
  deadline?: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  color?: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  color?: string;
  deadline?: string;
}

export interface ProjectProgress {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  progress: number;
}