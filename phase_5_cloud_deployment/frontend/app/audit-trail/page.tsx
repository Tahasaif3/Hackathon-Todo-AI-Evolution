'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/components/UserProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  CalendarIcon,
  ClockIcon,
  FilterIcon,
  RefreshCw,
  SearchIcon
} from 'lucide-react';
import { format } from 'date-fns';

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

const AuditTrailPage = () => {
  const { user } = useUser();
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;

  // Fetch audit trail data
  useEffect(() => {
    const fetchAuditTrail = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/${user.id}/audit`);

        if (!response.ok) {
          throw new Error(`Failed to fetch audit trail: ${response.statusText}`);
        }

        const data = await response.json();
        setAuditEvents(data.events || []);
        setFilteredEvents(data.events || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch audit trail');
        console.error('Error fetching audit trail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditTrail();
  }, [user]);

  // Apply filters and search
  useEffect(() => {
    let result = [...auditEvents];

    // Apply event type filter
    if (eventFilter !== 'all') {
      result = result.filter(event => event.event_type === eventFilter);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event =>
        event.event_data.title.toLowerCase().includes(query) ||
        event.event_data.description?.toLowerCase().includes(query) ||
        event.event_id.includes(query)
      );
    }

    setFilteredEvents(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [eventFilter, searchQuery, auditEvents]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  const refreshAuditTrail = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/${user.id}/audit`);

      if (!response.ok) {
        throw new Error(`Failed to refresh audit trail: ${response.statusText}`);
      }

      const data = await response.json();
      setAuditEvents(data.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh audit trail');
      console.error('Error refreshing audit trail:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'created':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'updated':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'deleted':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Audit Trail</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <Button onClick={refreshAuditTrail} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
        <p className="text-muted-foreground">
          View the complete history of all task operations for your account
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Audit Trail Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-600">Created</p>
              <p className="text-2xl font-bold text-green-800">
                {auditEvents.filter(e => e.event_type === 'created').length}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600">Updated</p>
              <p className="text-2xl font-bold text-blue-800">
                {auditEvents.filter(e => e.event_type === 'updated').length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-600">Completed</p>
              <p className="text-2xl font-bold text-purple-800">
                {auditEvents.filter(e => e.event_type === 'completed').length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-600">Deleted</p>
              <p className="text-2xl font-bold text-red-800">
                {auditEvents.filter(e => e.event_type === 'deleted').length}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={refreshAuditTrail} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEvents.length > 0 ? (
                  paginatedEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Badge className={getEventTypeColor(event.event_type)}>
                          {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {event.event_data.title}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {event.event_data.description || 'No description'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <ClockIcon className="mr-1 h-4 w-4" />
                          {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No audit events found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + eventsPerPage, filteredEvents.length)} of {filteredEvents.length} events
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-2 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTrailPage;