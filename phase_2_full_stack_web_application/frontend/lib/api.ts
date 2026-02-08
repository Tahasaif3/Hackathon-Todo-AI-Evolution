// API client configuration
// For Hugging Face deployment, use the public API URL from environment
// In development, fallback to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000');

// Import types
import { Task, TaskListResponse, Project, ProjectCreate, ProjectUpdate, ProjectProgress } from './types';

// API client functions that work with Better Auth and httpOnly cookies
// The backend handles JWT in httpOnly cookies, so we don't need to manually manage tokens

interface RegisterCredentials {
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterResponse {
  id: string;
  email: string;
  message: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: RegisterResponse;
}

export async function register(credentials: RegisterCredentials): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    // Include credentials (cookies) in the request
    credentials: 'include',
  });

  if (!response.ok) {
    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Registration failed';
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } else {
      // If not JSON, get the text response
      const errorText = await response.text();
      console.error('Non-JSON response:', errorText);
      errorMessage = `Registration failed with status ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }

  const result = await response.json();
  
  // Store the token in localStorage for cross-origin compatibility if returned
  if (result.access_token) {
    localStorage.setItem('auth_token', result.access_token);
  }
  
  return result;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    // Include credentials (cookies) in the request
    credentials: 'include',
  });

  if (!response.ok) {
    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Login failed';
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } else {
      // If not JSON, get the text response
      const errorText = await response.text();
      console.error('Non-JSON response:', errorText);
      errorMessage = `Login failed with status ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }

  const result = await response.json();
  
  // Store the token in localStorage for cross-origin compatibility
  if (result.access_token) {
    localStorage.setItem('auth_token', result.access_token);
  }
  
  return result;
}

// Function to logout user
export async function logout(): Promise<void> {
  try {
    // Make a request to the backend to clear the cookie
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
  } catch (error) {
    console.error('Error during logout:', error);
  }
  
  // Clear any client-side storage
  // Note: The httpOnly cookie can't be cleared from JavaScript, but the backend should handle this
  localStorage.removeItem('user');
  localStorage.removeItem('rememberMe');
  localStorage.removeItem('auth_token');
}

// Function to request password reset
export async function forgotPassword(email: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Failed to send reset link';
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } else {
      // If not JSON, get the text response
      const errorText = await response.text();
      console.error('Non-JSON response:', errorText);
      errorMessage = `Failed to send reset link with status ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
}

// Function to reset password
export async function resetPassword(email: string, newPassword: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, new_password: newPassword }),
  });

  if (!response.ok) {
    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Failed to reset password';
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } else {
      // If not JSON, get the text response
      const errorText = await response.text();
      console.error('Non-JSON response:', errorText);
      errorMessage = `Failed to reset password with status ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
}

// Function to check if user is authenticated
export async function getCurrentUser(): Promise<RegisterResponse | null> {
  try {
    console.log('Making request to /api/auth/me');
    
    // Try to get stored user data first as a fallback
    const storedUser = localStorage.getItem('user');
    
    // Get the stored JWT token
    const storedToken = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {}),
      },
    });

    console.log('Me endpoint response status:', response.status);
    console.log('Me endpoint response headers:', [...response.headers.entries()]);

    if (!response.ok) {
      console.log('Me endpoint response not ok:', response.status);
      console.log('Response text:', await response.text());
      
      // If we have stored user data, use it as fallback
      if (storedUser) {
        console.log('Using stored user data as fallback');
        return JSON.parse(storedUser);
      }
      
      return null;
    }

    const userData = await response.json();
    console.log('Me endpoint user data:', userData);
    
    // Store user data for future use
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return userData;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    
    // Try to return stored user data as a last resort
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      console.log('Returning stored user data as fallback');
      return JSON.parse(storedUser);
    }
    
    return null;
  }
}

// Function to get task statistics for a user
export async function getUserTaskStats(userId: string): Promise<{ total: number; completed: number; pending: number; completionRate: number }> {
  try {
    const response = await makeAuthenticatedRequest(`/api/${userId}/tasks/`);

    if (!response.ok) {
      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let errorMessage = 'Failed to fetch tasks';
      
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } else {
        // If not JSON, get the text response
        const errorText = await response.text();
        console.error('Non-JSON response:', errorText);
        errorMessage = `Failed to fetch tasks with status ${response.status}`;
      }
      
      console.error('Error fetching tasks:', errorMessage);
      throw new Error(errorMessage);
    }

    const data: TaskListResponse = await response.json();
    const tasks = data.tasks || [];

    // Calculate stats
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      completionRate
    };
  } catch (error) {
    console.error('Error fetching task stats:', error);
    throw error;
  }
}

// Global error handling for authenticated requests using JWT token
export async function makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}) {
  // Get the stored JWT token
  const storedToken = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {}),
      ...options.headers,
    },
  });

  // Handle different status codes
  if (response.status === 401) {
    // Invalid session, redirect to login
    throw new Error('Authentication required');
  }

  if (response.status === 404) {
    throw new Error('Resource not found');
  }

  if (response.status >= 500) {
    throw new Error('Server error, please try again later');
  }

  return response;
}

// Task-related API functions
export async function getTasks(userId: string): Promise<Task[]> {
  console.log(`Fetching tasks for user ID: ${userId}`);
  const response = await makeAuthenticatedRequest(`/api/${userId}/tasks/`);

  if (!response.ok) {
    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Failed to fetch tasks';
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } else {
      // If not JSON, get the text response
      const errorText = await response.text();
      console.error('Non-JSON response:', errorText);
      errorMessage = `Failed to fetch tasks with status ${response.status}`;
    }
    
    console.error('Error fetching tasks:', errorMessage);
    throw new Error(errorMessage);
  }

  const data: TaskListResponse = await response.json();
  console.log('Tasks fetched successfully:', data);
  return data.tasks;
}

export async function getTask(userId: string, taskId: number): Promise<Task> {
  const response = await makeAuthenticatedRequest(`/api/${userId}/tasks/${taskId}`);

  if (!response.ok) {
    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Failed to fetch task';
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } else {
      // If not JSON, get the text response
      const errorText = await response.text();
      console.error('Non-JSON response:', errorText);
      errorMessage = `Failed to fetch task with status ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function createTask(userId: string, taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Task> {
  const response = await makeAuthenticatedRequest(`/api/${userId}/tasks`, {
    method: 'POST',
    body: JSON.stringify({
      title: taskData.title,
      description: taskData.description,
      completed: taskData.completed || false,
      project_id: taskData.project_id,
      due_date: taskData.due_date
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create task');
  }

  return response.json();
}

export async function updateTask(userId: string, taskId: number, taskData: Partial<Task>): Promise<Task> {
  const response = await makeAuthenticatedRequest(`/api/${userId}/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update task');
  }

  return response.json();
}

// Specific function for partial updates (PATCH)
export async function patchTask(userId: string, taskId: number, taskData: Partial<Task>): Promise<Task> {
  const response = await makeAuthenticatedRequest(`/api/${userId}/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to partially update task');
  }

  return response.json();
}

export async function deleteTask(userId: string, taskId: number): Promise<void> {
  const response = await makeAuthenticatedRequest(`/api/${userId}/tasks/${taskId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete task');
  }
}

export async function toggleTaskCompletion(userId: string, taskId: number): Promise<Task> {
  const response = await makeAuthenticatedRequest(`/api/${userId}/tasks/${taskId}/toggle`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to toggle task completion');
  }

  return response.json();
}

// Project-related API functions
export async function getProjects(userId: string): Promise<Project[]> {
  const response = await makeAuthenticatedRequest(`/api/${userId}/projects/`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch projects');
  }

  return response.json();
}

export async function getProject(userId: string, projectId: string): Promise<Project> {
  const response = await makeAuthenticatedRequest(`/api/${userId}/projects/${projectId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch project');
  }

  return response.json();
}

export async function createProject(userId: string, projectData: ProjectCreate): Promise<Project> {
  const response = await makeAuthenticatedRequest(`/api/${userId}/projects`, {
    method: 'POST',
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create project');
  }

  return response.json();
}

export async function updateProject(userId: string, projectId: string, projectData: ProjectUpdate): Promise<Project> {
  const response = await makeAuthenticatedRequest(`/api/${userId}/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update project');
  }

  return response.json();
}

export async function deleteProject(userId: string, projectId: string): Promise<void> {
  const response = await makeAuthenticatedRequest(`/api/${userId}/projects/${projectId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete project');
  }
}

export async function getProjectTasks(userId: string, projectId: string): Promise<Task[]> {
  const response = await makeAuthenticatedRequest(`/api/${userId}/projects/${projectId}/tasks`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch project tasks');
  }

  const data: TaskListResponse = await response.json();
  return data.tasks;
}

export async function getProjectProgress(userId: string, projectId: string): Promise<ProjectProgress> {
  const response = await makeAuthenticatedRequest(`/api/${userId}/projects/${projectId}/progress`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch project progress');
  }

  return response.json();
}
