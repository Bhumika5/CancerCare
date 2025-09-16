import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Shield, 
  Heart, 
  Activity, 
  Eye, 
  Utensils, 
  Wind, 
  Sun,
  Calendar,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

const Awareness = () => {
  const earlyWarnings = [
    {
      icon: AlertTriangle,
      title: 'Unusual Lumps or Swelling',
      description: 'Any new lumps, bumps, or thickening of skin, especially in breast, neck, or underarms',
      severity: 'high'
    },
    {
      icon: Activity,
      title: 'Persistent Pain',
      description: 'Ongoing pain that doesn\'t go away or gets worse over time',
      severity: 'medium'
    },
    {
      icon: Eye,
      title: 'Changes in Skin',
      description: 'Unusual changes in moles, skin color, or texture. Any sores that don\'t heal',
      severity: 'high'
    },
    {
      icon: Wind,
      title: 'Persistent Cough',
      description: 'Cough that lasts more than 3 weeks, especially with blood',
      severity: 'high'
    },
    {
      icon: Utensils,
      title: 'Difficulty Swallowing',
      description: 'Trouble swallowing or persistent indigestion',
      severity: 'medium'
    },
    {
      icon: Activity,
      title: 'Unexplained Weight Loss',
      description: 'Sudden weight loss without diet changes or increased exercise',
      severity: 'high'
    }
  ];

  const preventionTips = [
    {
      icon: Utensils,
      title: 'Healthy Diet',
      description: 'Eat plenty of fruits, vegetables, and whole grains. Limit processed foods and red meat.',
      tips: ['5+ servings of fruits & vegetables daily', 'Choose whole grains over refined', 'Limit processed and red meat', 'Stay hydrated with 8-10 glasses of water']
    },
    {
      icon: Activity,
      title: 'Regular Exercise',
      description: 'Aim for at least 150 minutes of moderate exercise per week.',
      tips: ['30 minutes of walking daily', '2-3 strength training sessions weekly', 'Choose stairs over elevators', 'Join community sports or yoga classes']
    },
    {
      icon: XCircle,
      title: 'Avoid Tobacco',
      description: 'Tobacco use is the leading cause of preventable cancer deaths.',
      tips: ['Quit smoking completely', 'Avoid secondhand smoke', 'Say no to chewing tobacco', 'Seek help from quit-smoking programs']
    },
    {
      icon: Sun,
      title: 'Sun Protection',
      description: 'Protect your skin from harmful UV rays.',
      tips: ['Use SPF 30+ sunscreen daily', 'Wear protective clothing', 'Avoid peak sun hours (10am-4pm)', 'Regular skin self-examinations']
    }
  ];

  const dosAndDonts = {
    dos: [
      'Get regular health checkups and screenings',
      'Maintain a healthy weight',
      'Limit alcohol consumption',
      'Get recommended vaccinations (HPV, Hepatitis B)',
      'Practice safe sex',
      'Manage stress through meditation or yoga',
      'Get adequate sleep (7-9 hours nightly)',
      'Know your family medical history'
    ],
    donts: [
      'Don\'t ignore persistent symptoms',
      'Don\'t delay medical consultations',
      'Don\'t use tobacco in any form',
      'Don\'t drink excessive alcohol',
      'Don\'t ignore work-related chemical exposures',
      'Don\'t skip recommended screenings',
      'Don\'t self-medicate for persistent symptoms',
      'Don\'t panic - early detection improves outcomes'
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-healthcare-green to-green-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-green-200" />
            <h1 className="text-base lg:text-lg font-semibold mb-1">
              Cancer Awareness & Prevention
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Knowledge is your first line of defense. Learn about early warning signs, 
              prevention strategies, and take proactive steps towards a healthier life.
            </p>
          </div>
        </div>
      </section>

      {/* Early Warning Signs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-red-500" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Early Warning Signs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Recognizing these signs early can make all the difference. Don't ignore your body's signals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earlyWarnings.map((warning, index) => (
              <Card key={index} className={`hover:shadow-lg transition-shadow duration-300 ${
                warning.severity === 'high' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
              }`}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      warning.severity === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      <warning.icon className={`w-6 h-6 ${
                        warning.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <CardTitle className="text-lg font-semibold">{warning.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700 leading-relaxed">
                    {warning.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-4xl mx-auto">
              <Info className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <p className="text-lg text-red-800 font-medium mb-3">
                If you notice any of these signs, don't wait. Early detection saves lives.
              </p>
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                <Link to="/booking">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Screening Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Prevention Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Shield className="w-12 h-12 mx-auto mb-3 text-healthcare-green" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Prevention is the Best Medicine
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple lifestyle changes can significantly reduce your cancer risk. Start today.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {preventionTips.map((tip, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <tip.icon className="w-8 h-8 text-healthcare-green" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">{tip.title}</CardTitle>
                      <CardDescription className="text-gray-600">{tip.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tip.tips.map((tipItem, tipIndex) => (
                      <li key={tipIndex} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-healthcare-green mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{tipItem}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heart className="w-12 h-12 mx-auto mb-3 text-healthcare-blue" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Essential Do's and Don'ts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these guidelines to maximize your protection against cancer.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Do's */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-healthcare-green" />
                <CardTitle className="text-2xl font-bold text-healthcare-green">DO's</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {dosAndDonts.dos.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-healthcare-green mt-1 flex-shrink-0" />
                      <span className="text-gray-800 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Don'ts */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="text-center">
                <XCircle className="w-12 h-12 mx-auto mb-3 text-red-600" />
                <CardTitle className="text-2xl font-bold text-red-600">DON'Ts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {dosAndDonts.donts.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-800 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-healthcare-blue text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Calendar className="w-14 h-14 mx-auto mb-4 text-blue-200" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Take Action Today
          </h2>
          <p className="text-xl mb-6 text-blue-100 leading-relaxed">
            Armed with knowledge, now take the next step. Book your free cancer screening 
            and join thousands who've prioritized their health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-healthcare-blue hover:bg-gray-100 font-semibold">
              <Link to="/booking">
                <Calendar className="mr-2 h-5 w-5" />
                Book Free Screening
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-healthcare-blue">
              <Link to="/camps">
                <Shield className="mr-2 h-5 w-5" />
                Find Nearby Camps
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Awareness;
