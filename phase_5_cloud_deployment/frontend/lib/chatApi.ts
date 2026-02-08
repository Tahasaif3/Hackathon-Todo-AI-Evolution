// API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Chat API client for interacting with the chat endpoint
 */

interface ChatRequest {
  conversation_id?: number;
  message: string;
}

interface ChatResponse {
  conversation_id: number;
  response: string;
  tool_calls: Array<any>;
}

/**
 * Send a message to the chat endpoint
 */
export const sendMessage = async (
  userId: string,
  message: string,
  conversationId?: number
): Promise<ChatResponse> => {
  try {
    // Get the stored JWT token
    const storedToken = localStorage.getItem('auth_token');

    if (!storedToken) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/api/${userId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storedToken}`,
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        message: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Create a new conversation
 */
export const createConversation = async (
  userId: string,
  initialMessage: string
): Promise<ChatResponse> => {
  return sendMessage(userId, initialMessage);
};

/**
 * Get conversation details (if needed)
 */
export const getConversation = async (
  userId: string,
  conversationId: number
): Promise<any> => {
  try {
    // Get the stored JWT token
    const storedToken = localStorage.getItem('auth_token');

    if (!storedToken) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/api/${userId}/conversations/${conversationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${storedToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw error;
  }
};