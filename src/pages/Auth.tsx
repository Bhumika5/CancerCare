import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Heart } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const { setUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const API_URL = 'http://localhost:3000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Auth form submitted', { isLogin, formData });
    if (isLogin) {
      // Login with backend
      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        setUser(data.user);
        toast({
          title: 'Login Successful',
          description: 'Welcome back!'
        });
        navigate('/');
      } catch (err: any) {
        toast({
          title: 'Login Failed',
          description: err.message || 'Invalid email or password',
          variant: 'destructive'
        });
      }
    } else {
      if (!formData.name) {
        toast({
          title: 'Registration Failed',
          description: 'Please enter your name',
          variant: 'destructive'
        });
        return;
      }
      // Register with backend
      try {
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        setUser(data.user);
        toast({
          title: 'Registration Successful',
          description: 'Account created successfully!'
        });
        navigate('/');
      } catch (err: any) {
        toast({
          title: 'Registration Failed',
          description: err.message || 'User already exists',
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <img
          src="https://t4.ftcdn.net/jpg/05/44/14/19/240_F_544141932_YCw74LaswRqEPXVrMveXqRWKBxwBNSE3.jpg"
          alt="Cancer awareness ribbons background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <Navigation />
      <div className="py-12 flex justify-center md:justify-end items-center min-h-[80vh]">
  <div className="max-w-md w-full px-4 md:mr-60">
          <Card>
            <CardHeader className="text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-healthcare-blue" />
              <CardTitle>{isLogin ? 'Login' : 'Register'}</CardTitle>
              <CardDescription>
                {isLogin ? 'Sign in to your account' : 'Create a new account'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={false}>
                  {isLogin ? 'Login' : 'Register'}
                </Button>
              </form>
              
              <div className="mt-4 text-center text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-healthcare-blue hover:underline"
                >
                  {isLogin ? 'Register here' : 'Login here'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
