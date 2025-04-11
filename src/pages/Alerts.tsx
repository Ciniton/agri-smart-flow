
import React from 'react';

const Alerts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alerts</h1>
        <p className="text-muted-foreground mt-1">Manage system alerts and notifications</p>
      </div>
      
      <div className="bg-white rounded-lg border p-8 text-center">
        <h2 className="text-2xl font-semibold text-muted-foreground">Coming Soon</h2>
        <p className="mt-2">Alert management functionality will be available in the next update.</p>
      </div>
    </div>
  );
};

export default Alerts;
