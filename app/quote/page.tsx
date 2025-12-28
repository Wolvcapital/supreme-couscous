'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';

export default function QuotePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: '',
    origin: '',
    destination: '',
    weight: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase.from('quotes').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service_type: formData.service_type,
        origin: formData.origin,
        destination: formData.destination,
        weight: parseFloat(formData.weight),
        message: formData.message,
        status: 'pending',
      });

      if (error) throw error;

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service_type: '',
        origin: '',
        destination: '',
        weight: '',
        message: '',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to submit quote request. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <Link href="/tracking">
              <Button variant="ghost">Track Shipment</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Home</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Request a Quote
            </h1>
            <p className="text-slate-600">
              Fill out the form below and we'll get back to you shortly
            </p>
          </div>

          {success && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <p className="text-green-800 text-center font-medium">
                  Thank you for your quote request! We'll contact you soon.
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Quote Request Form</CardTitle>
              <CardDescription>
                Provide details about your shipment and we'll provide a custom quote
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_type">Service Type</Label>
                  <Select
                    value={formData.service_type}
                    onValueChange={(value) => setFormData({ ...formData, service_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="express">Express Delivery</SelectItem>
                      <SelectItem value="standard">Standard Delivery</SelectItem>
                      <SelectItem value="economy">Economy Delivery</SelectItem>
                      <SelectItem value="freight">Freight Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin City</Label>
                    <Input
                      id="origin"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      placeholder="e.g., Kabul"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination City</Label>
                    <Input
                      id="destination"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="e.g., Herat"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Estimated Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Information</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more about your shipment requirements..."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Quote Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
