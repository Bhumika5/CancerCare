import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar,
  MapPin,
  Users,
  Plus,
  Edit,
  Trash,
  Eye,
  Phone,
  User,
  Clock,
  Building,
  LogOut
} from 'lucide-react';

const API_URL = 'http://localhost:3000/camps';

const Staff = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('camps');
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  const [newCamp, setNewCamp] = useState({
    name: '',
    date: '',
    venue: '',
    state: 'Karnataka',
    district: '',
    startTime: '',
    endTime: '',
    slots: '',
    type: ''
  });

  // Check staff authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('staffAuthenticated');
    if (!isAuthenticated) {
      navigate('/staff-login');
      return;
    }
  }, [navigate]);

  // Fetch camps from backend on component mount
  useEffect(() => {
    fetchCamps();
    fetchBookings();
  }, []);

  const fetchCamps = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch camps');
      const data = await res.json();
      setCamps(data);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Could not load camps from server',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings from backend
  const fetchBookings = async () => {
    try {
      const res = await fetch('http://localhost:3000/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Could not load bookings from server',
        variant: 'destructive',
      });
    }
  };

  const karnatakaDistricts = [
    'Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Tumkur', 'Udupi', 'Shimoga', 'Bellary', 'Hassan'
  ];

  const handleAddCamp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamp.name || !newCamp.date || !newCamp.venue || !newCamp.state || !newCamp.district || !newCamp.startTime || !newCamp.endTime || !newCamp.type) {
      toast({
        title: 'Error',
        description: 'Please fill all fields',
        variant: 'destructive',
      });
      return;
    }
    try {
      setLoading(true);
      // Only send required fields to backend
      const campToSend = {
        name: newCamp.name,
        date: newCamp.date, // input type="date" gives YYYY-MM-DD
        venue: newCamp.venue,
        state: newCamp.state,
        district: newCamp.district,
        startTime: newCamp.startTime,
        endTime: newCamp.endTime,
        type: newCamp.type,
        status: 'upcoming',
        cancerTypes: [newCamp.type],
        contact: '+91 80 2670 6666',
      };
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campToSend),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add camp');
      }
      setNewCamp({
        name: '',
        date: '',
        venue: '',
        state: 'Karnataka',
        district: '',
        startTime: '',
        endTime: '',
        slots: '',
        type: ''
      });
      toast({
        title: 'Success',
        description: 'New camp added successfully!'
      });
      fetchCamps();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Could not add camp',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCamp = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/camps/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete camp');
      setCamps((prev) => prev.filter((camp: any) => (camp._id || camp.id) !== id));
      // keep localStorage in sync for offline/demo
      try {
        const local = JSON.parse(localStorage.getItem('camps') || '[]');
        const updated = Array.isArray(local) ? local.filter((c: any) => (c._id || c.id) !== id) : [];
        localStorage.setItem('camps', JSON.stringify(updated));
      } catch {}
      toast({ title: 'Deleted', description: 'Camp deleted successfully' });
    } catch (e: any) {
      // Fallback: delete locally if server unavailable
      setCamps((prev) => prev.filter((camp: any) => (camp._id || camp.id) !== id));
      try {
        const local = JSON.parse(localStorage.getItem('camps') || '[]');
        const updated = Array.isArray(local) ? local.filter((c: any) => (c._id || c.id) !== id) : [];
        localStorage.setItem('camps', JSON.stringify(updated));
      } catch {}
      toast({ title: 'Deleted (offline mode)', description: 'Server unavailable, removed locally.' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('staffAuthenticated');
    localStorage.removeItem('staffLoginTime');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out'
    });
    navigate('/staff-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Portal</h1>
              <p className="text-gray-600">Manage cancer screening camps and bookings</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="flex space-x-2 mb-8 bg-white p-2 rounded-lg shadow-sm">
          <Button
            variant={activeTab === 'camps' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('camps')}
            className="flex-1 h-12"
          >
            <Building className="w-4 h-4 mr-2" />
            Manage Camps ({camps.length})
          </Button>
          <Button
            variant={activeTab === 'add' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('add')}
            className="flex-1 h-12"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Camp
          </Button>
          <Button
            variant={activeTab === 'bookings' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('bookings')}
            className="flex-1 h-12"
          >
            <Users className="w-4 h-4 mr-2" />
            View Bookings ({bookings.length})
          </Button>
        </div>

        {activeTab === 'bookings' && (
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <Users className="w-6 h-6 mr-3" />
                All Bookings
              </CardTitle>
              <CardDescription className="text-blue-100">View all user bookings for screening appointments</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No bookings yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Camp</TableHead>
                        <TableHead>Booking Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking._id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2 text-gray-400" />
                              {booking.name}
                            </div>
                          </TableCell>
                          <TableCell>{booking.age}</TableCell>
                          <TableCell className="capitalize">{booking.gender}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              {booking.phone}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              {booking.district}, {booking.state}
                            </div>
                          </TableCell>
                          <TableCell>{booking.campName}</TableCell>
                          <TableCell>
                            {new Date(booking.bookingDate).toLocaleDateString()}<br/>
                            {new Date(booking.bookingDate).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={async () => {
                                try {
                                  const res = await fetch(`http://localhost:3000/bookings/${booking._id}`, { method: 'DELETE' });
                                  if (!res.ok) throw new Error('Failed to delete');
                                  setBookings((prev: any[]) => prev.filter((b: any) => b._id !== booking._id));
                                  try {
                                    const local = JSON.parse(localStorage.getItem('bookings') || '[]');
                                    const updated = Array.isArray(local) ? local.filter((b: any) => (b._id || b.id) !== booking._id) : [];
                                    localStorage.setItem('bookings', JSON.stringify(updated));
                                    window.dispatchEvent(new Event('bookings-updated'));
                                  } catch {}
                                  toast({ title: 'Deleted', description: 'Booking deleted successfully' });
                                } catch (e: any) {
                                  // Offline fallback
                                  setBookings((prev: any[]) => prev.filter((b: any) => b._id !== booking._id));
                                  try {
                                    const local = JSON.parse(localStorage.getItem('bookings') || '[]');
                                    const updated = Array.isArray(local) ? local.filter((b: any) => (b._id || b.id) !== booking._id) : [];
                                    localStorage.setItem('bookings', JSON.stringify(updated));
                                    window.dispatchEvent(new Event('bookings-updated'));
                                  } catch {}
                                  toast({ title: 'Deleted (offline mode)', description: 'Server unavailable, removed locally.' });
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'add' && (
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <Plus className="w-6 h-6 mr-3" />
                Add New Camp
              </CardTitle>
              <CardDescription className="text-green-100">Create a new cancer screening camp</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddCamp} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Camp Name *</Label>
                    <Input
                      id="name"
                      value={newCamp.name}
                      onChange={(e) => setNewCamp({...newCamp, name: e.target.value})}
                      placeholder="Enter camp name"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type" className="text-sm font-semibold text-gray-700">Camp Type *</Label>
                    <Select value={newCamp.type} onValueChange={(value) => setNewCamp({...newCamp, type: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select camp type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Cancer Screening">All Cancer Screening</SelectItem>
                        <SelectItem value="Breast Cancer">Breast Cancer</SelectItem>
                        <SelectItem value="Oral Cancer">Oral Cancer</SelectItem>
                        <SelectItem value="Lung Cancer">Lung Cancer</SelectItem>
                        <SelectItem value="Cervical Cancer">Cervical Cancer</SelectItem>
                        <SelectItem value="Colorectal Cancer">Colorectal Cancer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="date" className="text-sm font-semibold text-gray-700">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newCamp.date}
                      onChange={(e) => setNewCamp({...newCamp, date: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="startTime" className="text-sm font-semibold text-gray-700">Camp Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newCamp.startTime}
                      onChange={(e) => setNewCamp({...newCamp, startTime: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime" className="text-sm font-semibold text-gray-700">Camp End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newCamp.endTime}
                      onChange={(e) => setNewCamp({...newCamp, endTime: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="venue" className="text-sm font-semibold text-gray-700">Venue *</Label>
                  <Input
                    id="venue"
                    value={newCamp.venue}
                    onChange={(e) => setNewCamp({...newCamp, venue: e.target.value})}
                    placeholder="Enter venue details"
                    className="mt-1"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="state" className="text-sm font-semibold text-gray-700">State *</Label>
                    <Select value={newCamp.state} disabled>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="district" className="text-sm font-semibold text-gray-700">District *</Label>
                    <Select 
                      value={newCamp.district} 
                      onValueChange={(value) => setNewCamp({...newCamp, district: value})}
                      disabled={!newCamp.state}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {newCamp.state && karnatakaDistricts.map(district => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Camp
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'camps' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Existing Camps</h2>
              <Badge variant="outline" className="text-lg px-4 py-2">{camps.length} Active Camps</Badge>
            </div>
            
            <div className="grid gap-6">
              {camps.map((camp) => (
                <Card key={camp.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl mb-3 text-gray-900">{camp.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                            <span>{new Date(camp.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                            <MapPin className="w-4 h-4 mr-2 text-green-500" />
                            <span>{camp.district}, {camp.state}</span>
                          </div>
                          <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                            <Users className="w-4 h-4 mr-2 text-purple-500" />
                            <span>{camp.booked}/{camp.slots} booked</span>
                          </div>
                          <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                            <Clock className="w-4 h-4 mr-2 text-orange-500" />
                            <span>Added {new Date(camp.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 bg-blue-50 p-2 rounded-lg">{camp.venue}</p>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-sm px-3 py-1">{camp.type}</Badge>
                      </div>
                      
                      <div className="flex space-x-2 ml-6">
                        <Button size="sm" variant="outline" className="hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="hover:bg-green-50">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteCamp(camp._id || camp.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Staff;
