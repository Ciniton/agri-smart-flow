
import React from 'react';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1">View analytics and reports</p>
      </div>
      
      <div className="bg-white rounded-lg border p-8 text-center">
        <h2 className="text-2xl font-semibold text-muted-foreground">Coming Soon</h2>
        <p className="mt-2">Reporting functionality will be available in the next update.</p>
      </div>
    </div>
  );
};

export default Reports;
