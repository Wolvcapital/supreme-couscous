'use client';

import { useState, useEffect } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';
import type { Quote } from '@/types/database';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data as Quote[] || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await loadQuotes();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return;

    try {
      const { error } = await supabase.from('quotes').delete().eq('id', id);
      if (error) throw error;
      await loadQuotes();
    } catch (err) {
      console.error(err);
      alert('Failed to delete quote');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Quote Requests</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-slate-600 py-8">Loading...</p>
          ) : quotes.length === 0 ? (
            <p className="text-center text-slate-600 py-8">No quotes found</p>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{quote.name}</h3>
                      <p className="text-sm text-slate-600">{quote.email}</p>
                      <p className="text-sm text-slate-600">{quote.phone}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                        quote.status
                      )}`}
                    >
                      {quote.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-4 gap-3 mb-3 text-sm">
                    <div>
                      <span className="text-slate-600">Service:</span>
                      <p className="font-medium capitalize">{quote.service_type}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Origin:</span>
                      <p className="font-medium">{quote.origin}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Destination:</span>
                      <p className="font-medium">{quote.destination}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Weight:</span>
                      <p className="font-medium">{quote.weight} kg</p>
                    </div>
                  </div>

                  {quote.message && (
                    <div className="mb-3">
                      <span className="text-sm text-slate-600">Message:</span>
                      <p className="text-sm text-slate-900 mt-1">{quote.message}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-xs text-slate-500">
                      {new Date(quote.created_at).toLocaleString()}
                    </span>
                    <div className="flex gap-2">
                      {quote.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(quote.id, 'contacted')}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Mark as Contacted
                        </Button>
                      )}
                      {quote.status === 'contacted' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(quote.id, 'completed')}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Mark as Completed
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(quote.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
