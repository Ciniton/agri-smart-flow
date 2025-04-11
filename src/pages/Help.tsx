
import React from 'react';

const Help: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground mt-1">Find answers and support resources</p>
      </div>
      
      <div className="bg-white rounded-lg border p-8 text-center">
        <h2 className="text-2xl font-semibold text-muted-foreground">Coming Soon</h2>
        <p className="mt-2">Help resources will be available in the next update.</p>
      </div>
    </div>
  );
};

export default Help;
