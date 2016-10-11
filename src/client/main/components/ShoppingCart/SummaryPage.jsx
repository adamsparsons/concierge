import React from 'react';

import { Shell } from '../ContentPage.jsx';
import Summary   from './Summary.jsx';

const PlanSummaryPage = () => {
  return (
    <Shell title="Plan Summary" name="plan-summary-page" big="false">
      <Summary />
    </Shell>
  );
};

module.exports = PlanSummaryPage;
