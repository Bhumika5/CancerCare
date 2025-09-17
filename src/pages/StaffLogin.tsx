import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock, User } from 'lucide-react';

const StaffLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Single staff credential
  const STAFF_CREDENTIALS = {
    username: 'admin',
    password: 'staff123'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.username === STAFF_CREDENTIALS.username && 
        credentials.password === STAFF_CREDENTIALS.password) {
      
      // Set staff authentication in localStorage
      localStorage.setItem('staffAuthenticated', 'true');
      localStorage.setItem('staffLoginTime', new Date().toISOString());
      
      toast({
        title: 'Login Successful',
        description: 'Welcome to the Staff Portal!'
      });
      
      navigate('/staff');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password',
        variant: 'destructive'
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      <Navigation />
      
      <div className="py-12 flex justify-center items-center min-h-[80vh]">
        <div className="max-w-md w-full px-4">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Staff Portal Login</CardTitle>
              <CardDescription className="text-blue-100">
                Access the administrative dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="username" className="text-sm font-semibold text-gray-700 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    placeholder="Enter username"
                    className="mt-2 h-12"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    placeholder="Enter password"
                    className="mt-2 h-12"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Demo Credentials
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Username:</strong> admin</p>
                  <p><strong>Password:</strong> staff123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;