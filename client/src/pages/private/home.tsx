import React from 'react';

import SummaryCard from '@/components/shared/summary-card';

const HomePage = () => {
  return (
    <div>
      <SummaryCard variant="potential" value={1145000} withShadow />
    </div>
  );
};

export default HomePage;
