import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { BarChart, PieChart, Grid, LineChart, Brain } from 'lucide-react';

const Prediction = () => {
  const [activeTab, setActiveTab] = useState('bar');

  const images = {
    bar: { src: '/image/age.png', alt: 'Age Distribution' },
    pie: { src: '/image/cancer.png', alt: 'Cancer Type Distribution' },
    heatmap: { src: '/image/actual.png', alt: 'Heatmap' },
    roc: { src: '/image/false.png', alt: 'Confusion Matrix' },
    // roc: { src: '/image/false.png', alt: 'ROC Curve' },
  };

  const icons: Record<string, JSX.Element> = {
    bar: <BarChart className="w-4 h-4 inline-block mr-2" />,
    pie: <PieChart className="w-4 h-4 inline-block mr-2" />,
    heatmap: <Grid className="w-4 h-4 inline-block mr-2" />,
    line: <LineChart className="w-4 h-4 inline-block mr-2" />,
    roc: <Brain className="w-4 h-4 inline-block mr-2" />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <section className="bg-gradient-to-br from-orange-600 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-orange-200" />
          <h1 className="text-base lg:text-lg font-semibold mb-1">AI Prediction</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Advanced machine learning models for early cancer detection and risk assessment
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Data Visualizations</h2>

          {/* Tabs */}
          <div className="flex border-b mb-6 space-x-2">
            {Object.keys(images).map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium rounded-t ${
                  activeTab === tab
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {icons[tab]}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Active Image */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <img
              src={images[activeTab].src}
              alt={images[activeTab].alt}
              className="mx-auto max-w-full h-auto"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Prediction;
