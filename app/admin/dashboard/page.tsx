'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';
import type { Shipment } from '@/types/database';

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadShipments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShipments(data as Shipment[] || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Shipments</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Shipment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-slate-600 py-8">Loading...</p>
          ) : shipments.length === 0 ? (
            <p className="text-center text-slate-600 py-8">No shipments found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Tracking #</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Origin</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Destination</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Created</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((shipment) => (
                    <tr key={shipment.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-sm">{shipment.tracking_number}</td>
                      <td className="py-3 px-4">{shipment.origin}</td>
                      <td className="py-3 px-4">{shipment.destination}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800 capitalize">
                          {shipment.current_status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {new Date(shipment.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
