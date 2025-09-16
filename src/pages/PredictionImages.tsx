import React, { useState } from 'react';

const PredictionImages = () => {
  const [activeTab, setActiveTab] = useState('bar');

  const images = {
    bar: { src: '/images/actual.png', alt: 'Age Distribution' },
    pie: { src: '/images/cancer_type.png', alt: 'Cancer Type Distribution' },
    heatmap: { src: '/images/heatmap.png', alt: 'Heatmap' },
    line: { src: '/images/confusion_matrix.png', alt: 'Confusion Matrix' },
    roc: { src: '/images/roc_curve.png', alt: 'ROC Curve' },
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Data Visualizations</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
        {Object.keys(images).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              backgroundColor: activeTab === tab ? '#60a5fa' : '#f0f0f0',
              color: activeTab === tab ? 'white' : 'black',
              cursor: 'pointer'
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Display active image */}
      <div>
        <img
          src={images[activeTab].src}
          alt={images[activeTab].alt}
          style={{ width: '100%', maxWidth: '600px', borderRadius: '5px' }}
        />
      </div>
    </div>
  );
};

export default PredictionImages;
