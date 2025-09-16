# CancerCare Portal - Early Detection Saves Lives

## Project Overview

CancerCare Portal is a comprehensive web application designed to facilitate cancer screening appointments and provide awareness resources across South India. The platform connects patients with healthcare providers, organizes screening camps, and offers data analytics for better healthcare management.

## Features

- **User Registration & Authentication**: Secure login system for patients and healthcare providers
- **Appointment Booking**: Easy-to-use interface for scheduling cancer screening appointments
- **Awareness Resources**: Educational content about cancer prevention and early detection
- **Screening Camps**: Information about organized cancer screening camps
- **Data Analytics**: Comprehensive analytics dashboard for healthcare insights
- **Prediction Tools**: AI-powered risk assessment and prediction features
- **Staff Portal**: Dedicated interface for healthcare staff and administrators

## Technologies Used

This project is built with:

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Charts**: Recharts for data visualization
- **Routing**: React Router for navigation
- **State Management**: React Context API
- **Backend**: Node.js with Express (in Backend folder)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd ind-care-connect-south-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to view the application

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd Backend
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   npm start
   ```

## Project Structure

```
ind-care-connect-south-main/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── Backend/                # Node.js backend server
├── public/                 # Static assets
└── package.json           # Frontend dependencies
```

## Key Pages

- **Home** (`/`): Landing page with overview and quick actions
- **Awareness** (`/awareness`): Educational content about cancer
- **Camps** (`/camps`): Information about screening camps
- **Booking** (`/booking`): Appointment booking system
- **Analytics** (`/analytics`): Data visualization dashboard
- **Prediction** (`/prediction`): Risk assessment tools
- **Staff** (`/staff`): Administrative interface

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
