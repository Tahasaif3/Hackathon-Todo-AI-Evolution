'use client';

import { useState, useEffect } from 'react';
import { TaskForm } from "@/components/TaskForm";
import { useRouter } from 'next/navigation';
import { getTask } from '@/lib/api';
import { Task } from '@/lib/types';

export default function EditTaskPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadParamsAndFetchTask = async () => {
      try {
        // Await the params Promise to get the actual params
        const resolvedParams = await params;
        
        console.log('EditTaskPage - resolvedParams.id:', resolvedParams.id);
        console.log('EditTaskPage - typeof resolvedParams.id:', typeof resolvedParams.id);
        
        // Get user ID from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }
        
        const user = JSON.parse(userStr);
        const userId = user.id;
        
        if (!userId) {
          setError('User ID not found');
          setLoading(false);
          return;
        }
        
        console.log('EditTaskPage - userId:', userId);
        
        // Validate the task ID parameter
        if (!resolvedParams.id || resolvedParams.id === undefined || resolvedParams.id === null || resolvedParams.id === '') {
          setError('Task ID parameter is missing');
          setLoading(false);
          return;
        }
        
        // Convert to string first, then to number
        const taskIdString = String(resolvedParams.id);
        const taskId = parseInt(taskIdString, 10);
        
        console.log('EditTaskPage - taskIdString:', taskIdString);
        console.log('EditTaskPage - taskId:', taskId);
        
        if (isNaN(taskId) || taskId <= 0) {
          setError('Invalid task ID: must be a positive number');
          setLoading(false);
          return;
        }
        
        const fetchedTask = await getTask(userId, taskId);
        console.log('EditTaskPage - fetchedTask:', fetchedTask);
        setTask(fetchedTask);
      } catch (err: any) {
        console.error('Error fetching task:', err);
        setError(err.message || 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };
    
    loadParamsAndFetchTask();
  }, [params]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-400">Loading task...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/tasks')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back to Tasks
          </button>
        </div>
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Task not found</p>
          <button
            onClick={() => router.push('/tasks')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back to Tasks
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Edit Task</h1>
              <button
                onClick={() => router.push('/tasks')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <TaskForm 
              initialTask={task}
              isEditing={true} 
              onSuccess={() => router.push('/tasks')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}