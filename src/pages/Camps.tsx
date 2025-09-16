import { useState, useMemo, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Heart, 
  Search,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Camps = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [camps, setCamps] = useState([]);

  // Karnataka districts
  const karnatakaDistricts = [
    'Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Tumkur', 'Udupi', 'Shimoga', 'Bellary', 'Hassan'
  ];

  // Fetch camps from backend API
  useEffect(() => {
    fetch('http://localhost:3000/camps')
      .then(res => res.json())
      .then(data => setCamps(data))
      .catch(err => console.error('Failed to fetch camps:', err));
  }, []);

  const filteredCamps = useMemo(() => {
    return camps.filter(camp => {
      const matchesSearch = camp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           camp.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           camp.district.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesState = selectedState === 'all' || camp.state === selectedState;
      const matchesDistrict = selectedDistrict === 'all' || camp.district === selectedDistrict;
      
      return matchesSearch && matchesState && matchesDistrict;
    });
  }, [searchTerm, selectedState, selectedDistrict, camps]);

  const getStatusBadge = (status: string, availableSlots: number) => {
    if (availableSlots <= 5) {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Almost Full</Badge>;
    } else if (availableSlots <= 15) {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Filling Fast</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Available</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navigation />
      
      {/* Enhanced Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-base lg:text-lg font-semibold mb-1 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Screening Camps Near You
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Find and book cancer screening camps across South India. Free screenings 
              with certified medical professionals at convenient locations.
            </p>
            <div className="mt-6 flex justify-center">
              <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2 text-lg">
                {camps.length} Active Camps Available
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Filters Section */}
      <section className="py-6 bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search camps or venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2 focus:border-blue-500"
              />
            </div>
            
            <Select value={selectedState} onValueChange={(value) => {
              setSelectedState(value);
              setSelectedDistrict('all');
            }}>
              <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={selectedDistrict} 
              onValueChange={setSelectedDistrict}
              disabled={selectedState === 'all'}
            >
              <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {karnatakaDistricts.map(district => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="h-12 border-2 hover:bg-gray-50" onClick={() => {
              setSearchTerm('');
              setSelectedState('all');
              setSelectedDistrict('all');
            }}>
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Camps Listing */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {filteredCamps.length} Camp{filteredCamps.length !== 1 ? 's' : ''} Found
            </h2>
            <p className="text-gray-600 text-lg">
              {selectedState !== 'all' && `in ${selectedState}`} 
              {selectedDistrict !== 'all' && `, ${selectedDistrict}`}
            </p>
          </div>

          {filteredCamps.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <MapPin className="w-20 h-20 mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No camps found</h3>
              <p className="text-gray-600 mb-6 text-lg">Try adjusting your search criteria or check back later for new camps.</p>
              <Button size="lg" onClick={() => {
                setSearchTerm('');
                setSelectedState('all');
                setSelectedDistrict('all');
              }}>
                Show All Camps
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCamps.map((camp) => (
                <Card key={camp.id} className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <CardTitle className="text-xl font-bold mb-2 text-gray-900">{camp.name}</CardTitle>
                        <CardDescription className="flex items-center text-gray-600 text-base">
                          <MapPin className="w-4 h-4 mr-2" />
                          {camp.district}, {camp.state}
                        </CardDescription>
                      </div>
                      {getStatusBadge(camp.status, camp.availableSlots || camp.slots)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                      <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                      <span className="font-medium">{camp.venue}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                      <Calendar className="w-5 h-5 mr-3 text-green-500" />
                      <span className="font-medium">{formatDate(camp.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                      <Clock className="w-5 h-5 mr-3 text-purple-500" />
                      <span className="font-medium">
                        {camp.startTime && camp.endTime
                          ? `${camp.startTime} - ${camp.endTime}`
                          : '09:00 - 17:00'}
                      </span>
                    </div>

                    {camp.cancerTypes && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2">Cancer Types Screened:</p>
                        <div className="flex flex-wrap gap-2">
                          {camp.cancerTypes.map((type, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-3">
                      <Button asChild className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        <Link to={`/booking?camp=${camp._id}`}>
                          <Heart className="w-4 h-4 mr-2" />
                          Book Now
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="h-12 px-4 hover:bg-gray-50">
                        <a href={`tel:${camp.contact}`} className="flex items-center">
                          Call
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Info Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-6">What to Expect at Screening Camps</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <Clock className="w-10 h-10 mx-auto mb-4 text-blue-600" />
              <h4 className="font-bold mb-3 text-lg text-gray-900">Quick Process</h4>
              <p className="text-gray-600">Average screening takes 15-30 minutes</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <Users className="w-10 h-10 mx-auto mb-4 text-blue-600" />
              <h4 className="font-bold mb-3 text-lg text-gray-900">Expert Care</h4>
              <p className="text-gray-600">Certified medical professionals conduct all screenings</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <Heart className="w-10 h-10 mx-auto mb-4 text-blue-600" />
              <h4 className="font-bold mb-3 text-lg text-gray-900">Free Service</h4>
              <p className="text-gray-600">All screenings are completely free of charge</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Camps;
