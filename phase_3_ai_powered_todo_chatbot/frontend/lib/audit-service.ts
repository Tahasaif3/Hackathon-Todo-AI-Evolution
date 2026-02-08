// lib/audit-service.ts

interface AuditEvent {
  id: number;
  event_id: string;
  event_type: string;
  user_id: string;
  task_id: number;
  event_data: {
    title: string;
    description?: string;
    completed: boolean;
  };
  timestamp: string;
}

interface AuditResponse {
  events: AuditEvent[];
}

export interface AuditFilters {
  eventType?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'timestamp' | 'event_type' | 'task_id'; // Default is timestamp
  sortOrder?: 'asc' | 'desc'; // Default is desc
}

/**
 * Fetch audit trail for a specific user
 * @param userId The ID of the user whose audit trail to fetch
 * @param filters Optional filters for the audit events
 * @returns Promise resolving to audit events
 */
export const fetchAuditTrail = async (
  userId: string,
  filters?: AuditFilters
): Promise<AuditResponse> => {
  const params = new URLSearchParams();

  if (filters?.eventType) {
    params.append('event_type', filters.eventType);
  }
  if (filters?.limit) {
    params.append('limit', filters.limit.toString());
  }
  if (filters?.offset) {
    params.append('offset', filters.offset.toString());
  }
  if (filters?.sortBy) {
    params.append('sort_by', filters.sortBy);
  }
  if (filters?.sortOrder) {
    params.append('sort_order', filters.sortOrder);
  }

  const queryString = params.toString();
  const url = `/api/${userId}/audit${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch audit trail: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch a specific audit event by ID
 * @param userId The ID of the user
 * @param eventId The ID of the audit event
 * @returns Promise resolving to a single audit event
 */
export const fetchAuditEventById = async (
  userId: string,
  eventId: number
): Promise<AuditEvent> => {
  const response = await fetch(`/api/${userId}/audit/${eventId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch audit event: ${response.statusText}`);
  }

  return response.json();
};