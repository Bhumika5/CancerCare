import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Heart, 
  Shield, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Award,
  Phone
} from 'lucide-react';

const Index = () => {
  const stats = [
    { icon: Calendar, label: 'Screening Camps', value: '150+', color: 'text-healthcare-blue' },
    { icon: Users, label: 'Lives Screened', value: '25,000+', color: 'text-healthcare-green' },
    { icon: MapPin, label: 'Cities Covered', value: '45+', color: 'text-healthcare-orange' },
    { icon: Heart, label: 'Early Detections', value: '1,200+', color: 'text-red-500' },
  ];

  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Book your screening appointment in just a few clicks'
    },
    {
      icon: MapPin,
      title: 'Convenient Locations',
      description: 'Find screening camps near you across South India'
    },
    {
      icon: Shield,
      title: 'Expert Care',
      description: 'Certified medical professionals and modern equipment'
    },
    {
      icon: Clock,
      title: 'Quick Results',
      description: 'Get your screening results within 24-48 hours'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-healthcare-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                Early Detection
                <span className="block text-yellow-300">Saves Lives</span>
              </h1>
              <p className="text-xl mb-6 text-blue-100 leading-relaxed">
                Join thousands across South India in the fight against cancer. 
                Book your free screening today and take the first step towards a healthier future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-healthcare-blue hover:bg-gray-100 font-semibold">
                  <Link to="/booking">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Free Screening
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-healthcare-blue text-healthcare-blue bg-white hover:bg-healthcare-blue hover:text-white font-semibold">
                  <Link to="/camps">
                    <MapPin className="mr-2 h-5 w-5" />
                    View Nearby Camps
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Heart className="w-28 h-28 text-white/80" />
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center">
                  <Shield className="w-10 h-10 text-healthcare-blue" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in">
                <div className="flex justify-center mb-3">
                  <div className={`w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center`}>
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Why Choose CancerCare Portal?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make cancer screening accessible, convenient, and reliable for everyone across South India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-3">
                    <div className="w-14 h-14 bg-healthcare-lightBlue rounded-full flex items-center justify-center">
                      <feature.icon className="w-7 h-7 text-healthcare-blue" />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-healthcare-blue text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <CheckCircle className="w-14 h-14 mx-auto mb-4 text-green-300" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Don't Wait. Early Detection is Key.
          </h2>
          <p className="text-xl mb-6 text-blue-100 leading-relaxed">
            Cancer detected early has a 90% better survival rate. Book your free screening today 
            and join thousands who've taken control of their health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-healthcare-blue hover:bg-gray-100 font-semibold">
              <Link to="/booking">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Screening Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-healthcare-blue">
              <Link to="/awareness">
                <TrendingUp className="mr-2 h-5 w-5" />
                Learn About Prevention
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center justify-center w-10 h-10 bg-healthcare-blue rounded-full">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">CancerCare Portal</h3>
                  <p className="text-sm text-gray-400">Early Detection Saves Lives</p>
                </div>
              </div>
              <p className="text-gray-400 mb-3">
                Providing accessible cancer screening services across South India to save lives through early detection.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/awareness" className="text-gray-400 hover:text-white transition-colors">Cancer Awareness</Link></li>
                <li><Link to="/camps" className="text-gray-400 hover:text-white transition-colors">Screening Camps</Link></li>
                <li><Link to="/booking" className="text-gray-400 hover:text-white transition-colors">Book Screening</Link></li>
                <li><Link to="/analytics" className="text-gray-400 hover:text-white transition-colors">Data Analytics</Link></li>
                <li><Link to="/prediction" className="text-gray-400 hover:text-white transition-colors">AI Prediction</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-3">Emergency Contact</h4>
              <div className="flex items-center space-x-2 text-red-400 mb-2">
                <Phone className="w-5 h-5" />
                <span className="text-lg font-semibold">108 (Emergency)</span>
              </div>
              <p className="text-gray-400 text-sm">
                24/7 Emergency medical assistance available across all states
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400">
            <p>&copy; 2024 CancerCare Portal. All rights reserved. | Early Detection Saves Lives</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
