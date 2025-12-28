'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Search, MapPin, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';
import type { Shipment, ShipmentStatusLog } from '@/types/database';
import { formatTrackingNumber } from '@/lib/utils/tracking';

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [statusLogs, setStatusLogs] = useState<ShipmentStatusLog[]>([]);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShipment(null);
    setStatusLogs([]);

    try {
      const formattedTracking = formatTrackingNumber(trackingNumber);

      const { data: shipmentData, error: shipmentError } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_number', formattedTracking)
        .maybeSingle();

      if (shipmentError) throw shipmentError;

      if (!shipmentData) {
        setError('Tracking number not found. Please check and try again.');
        setLoading(false);
        return;
      }

      setShipment(shipmentData as Shipment);

      const { data: logsData, error: logsError } = await supabase
        .from('shipment_status_logs')
        .select('*')
        .eq('shipment_id', shipmentData.id)
        .order('created_at', { ascending: false });

      if (logsError) throw logsError;

      setStatusLogs(logsData as ShipmentStatusLog[] || []);
    } catch (err) {
      console.error(err);
      setError('An error occurred while tracking your shipment.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string, index: number) => {
    if (index === 0) {
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    }
    return <Circle className="h-5 w-5 text-slate-300" />;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-slate-800" />
            <span className="text-xl font-bold text-slate-800">AFGHCO</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/quote">
              <Button variant="ghost">Get Quote</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Home</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 text-center">
            Track Your Shipment
          </h1>
          <p className="text-slate-600 text-center">
            Enter your tracking number to view real-time updates
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleTrack} className="flex gap-3">
            <Input
              type="text"
              placeholder="Enter tracking number (e.g., AFG-2024-1234)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="h-12 text-base"
              required
            />
            <Button type="submit" size="lg" disabled={loading} className="px-8">
              {loading ? (
                'Tracking...'
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Track
                </>
              )}
            </Button>
          </form>
          {error && (
            <p className="text-red-600 mt-3 text-sm">{error}</p>
          )}
        </div>

        {shipment && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Shipment Details</span>
                  <span className="text-sm font-mono bg-slate-100 px-3 py-1 rounded">
                    {shipment.tracking_number}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Sender</h4>
                    <p className="text-slate-700">{shipment.sender_name}</p>
                    <p className="text-sm text-slate-600">{shipment.sender_phone}</p>
                    <p className="text-sm text-slate-600">{shipment.sender_address}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Receiver</h4>
                    <p className="text-slate-700">{shipment.receiver_name}</p>
                    <p className="text-sm text-slate-600">{shipment.receiver_phone}</p>
                    <p className="text-sm text-slate-600">{shipment.receiver_address}</p>
                  </div>
                </div>
                <div className="border-t pt-4 grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Origin</p>
                    <p className="font-semibold text-slate-900">{shipment.origin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Destination</p>
                    <p className="font-semibold text-slate-900">{shipment.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Weight</p>
                    <p className="font-semibold text-slate-900">{shipment.weight} kg</p>
                  </div>
                </div>
                {shipment.estimated_delivery && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-slate-600 mb-1">Estimated Delivery</p>
                    <p className="font-semibold text-slate-900 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-slate-600" />
                      {new Date(shipment.estimated_delivery).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tracking History</CardTitle>
              </CardHeader>
              <CardContent>
                {statusLogs.length === 0 ? (
                  <p className="text-slate-600">No tracking history available yet.</p>
                ) : (
                  <div className="space-y-6">
                    {statusLogs.map((log, index) => (
                      <div key={log.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          {getStatusIcon(log.status, index)}
                          {index < statusLogs.length - 1 && (
                            <div className="w-px h-12 bg-slate-200 my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-slate-900 capitalize">
                              {log.status.replace('_', ' ')}
                            </h4>
                            <span className="text-sm text-slate-500">
                              {new Date(log.created_at).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-slate-600 mb-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {log.location}
                          </div>
                          {log.notes && (
                            <p className="text-sm text-slate-600 mt-1">{log.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
