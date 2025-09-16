import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Calendar, MapPin, Clock, User, Phone, Mail } from 'lucide-react';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const campId = searchParams.get('camp');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    state: '',
    district: ''
  });

  const [selectedCamp, setSelectedCamp] = useState(null);
  const [camps, setCamps] = useState([]);

  const karnatakaDistricts = [
    'Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Tumkur', 'Udupi', 'Shimoga', 'Bellary', 'Hassan'
  ];

  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    // Fetch camps from backend
    fetch(`${API_URL}/camps`)
      .then(res => res.json())
      .then(data => {
        setCamps(data);
        if (campId) {
          const camp = data.find(c => c._id === campId || c.id?.toString() === campId);
          if (camp) setSelectedCamp(camp);
        }
      })
      .catch(err => {
        toast({
          title: 'Error',
          description: 'Could not load camps from server',
          variant: 'destructive',
        });
      });
  }, [campId, toast]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to book an appointment",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
  }, [isAuthenticated, navigate, toast]);

  const handleCampSelect = (campId) => {
    const camp = camps.find(c => c._id === campId || c.id?.toString() === campId);
    setSelectedCamp(camp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCamp) {
      toast({
        title: 'Error',
        description: 'Please select a camp',
        variant: 'destructive',
      });
      return;
    }
    try {
      const bookingToSend = {
        ...formData,
        campId: selectedCamp._id || selectedCamp.id,
        campName: selectedCamp.name,
        state: selectedCamp.state,
        district: selectedCamp.district,
        bookingDate: new Date().toISOString(),
        status: 'Confirmed',
      };
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingToSend),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to book appointment');
      }
      // Also persist locally so analytics updates instantly
      try {
        const saved = await res.json();
        const local = JSON.parse(localStorage.getItem('bookings') || '[]');
        local.push(saved || bookingToSend);
        localStorage.setItem('bookings', JSON.stringify(local));
        window.dispatchEvent(new Event('bookings-updated'));
      } catch {}
      toast({
        title: 'Booking Confirmed!',
        description: `Your appointment has been booked for ${selectedCamp.name}.`
      });
      setFormData({
        name: '',
        age: '',
        gender: '',
        phone: '',
        email: '',
        address: '',
        state: '',
        district: ''
      });
    } catch (err: any) {
      // Fallback: save locally so analytics still updates
      try {
        const local = JSON.parse(localStorage.getItem('bookings') || '[]');
        const localBooking = { ...formData, campId: selectedCamp?._id || selectedCamp?.id, campName: selectedCamp?.name, state: selectedCamp?.state, district: selectedCamp?.district, bookingDate: new Date().toISOString(), status: 'Confirmed' };
        local.push(localBooking);
        localStorage.setItem('bookings', JSON.stringify(local));
        window.dispatchEvent(new Event('bookings-updated'));
      } catch {}
      toast({
        title: 'Error',
        description: err.message || 'Could not book appointment',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  // Show a message if no camp is found for the given campId
  if (campId && !selectedCamp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Camp Not Found</h1>
          <p className="text-lg text-gray-600 mb-4">The camp you are trying to book does not exist or could not be loaded.</p>
          <a href="/camps" className="text-blue-500 hover:text-blue-700 underline">Return to Camps</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navigation />
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-base font-semibold text-gray-900 mb-1">Book Your Screening</h1>
          <p className="text-gray-600 text-lg">Take the first step towards better health</p>
        </div>

        {/* Camp Selection Dropdown if no camp is pre-selected */}
        {!selectedCamp && (
          <Card className="mb-8 shadow-lg border-l-4 border-l-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-xl">Select a Screening Camp</CardTitle>
              <CardDescription className="text-blue-100">Choose a camp to book your screening</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Select onValueChange={handleCampSelect}>
                <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                  <SelectValue placeholder="Select a camp" />
                </SelectTrigger>
                <SelectContent>
                  {camps.length === 0 ? (
                    <div className="text-gray-500 px-4 py-2">No camps available</div>
                  ) : (
                    camps.map(camp => (
                      <SelectItem key={camp._id} value={camp._id}>
                        {camp.name} ({camp.district}, {camp.state}) - {new Date(camp.date).toLocaleDateString()}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Show selected camp details if a camp is selected */}
        {selectedCamp && (
          <Card className="mb-8 shadow-lg border-l-4 border-l-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-xl">{selectedCamp.name}</CardTitle>
              <CardDescription className="text-blue-100">Selected Camp Details</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                  <span className="font-medium">{new Date(selectedCamp.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <Clock className="w-5 h-5 mr-3 text-green-500" />
                  <span className="font-medium">{selectedCamp.time || '9:00 AM - 5:00 PM'}</span>
                </div>
                <div className="flex items-center bg-gray-50 p-3 rounded-lg col-span-1 md:col-span-2">
                  <MapPin className="w-5 h-5 mr-3 text-purple-500" />
                  <span className="font-medium">{selectedCamp.venue}, {selectedCamp.district}, {selectedCamp.state}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Form (only if a camp is selected) */}
        {selectedCamp && (
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="text-xl">Personal Information</CardTitle>
              <CardDescription className="text-green-100">Please fill in your details for the appointment</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your full name"
                      className="mt-2 h-12"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-sm font-semibold text-gray-700">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      placeholder="Enter your age"
                      className="mt-2 h-12"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">Gender *</Label>
                    <Select value={formData.gender || undefined} onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Enter your phone number"
                      className="mt-2 h-12"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email address"
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Address *
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter your address"
                    className="mt-2 h-12"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="district" className="text-sm font-semibold text-gray-700">District *</Label>
                  <Select
                    value={formData.district || undefined}
                    onValueChange={(value) => setFormData({ ...formData, district: value })}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {karnatakaDistricts.filter(Boolean).map((district) => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Booking Information
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your appointment will be booked for {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}.
                    You will receive a confirmation with your booking details.
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Confirm Booking
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Booking;
