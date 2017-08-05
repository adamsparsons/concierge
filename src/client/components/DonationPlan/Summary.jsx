import React            from 'react';
import Link             from '../../services/LinkToRoute';

import BackLink         from '../BackLink.jsx';
import Totals           from './Totals.jsx';
import EmailPlanButton  from './EmailPlanButton.jsx';
import Plan             from './Plan.jsx';
import RequestConsult   from './RequestConsult.jsx';
import SummaryUser      from './SummaryUser.jsx';

class SummaryListing extends Plan {
  get readonly() {
    return true;
  }
}

class Summary extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      msg: '',
      error: ''
    };
  }

  onDone = (done) => this.setState({ done });
  onError = (error) => this.setState({ error });

  render() {

    const {
      mobile,
      store
    } = this.props;

    const {
      done,
      error
    } = this.state;

    return (
      <div>
        {mobile && <SummaryUser store={store} />}
        <div className="padded-form summary-form">
          <div className="row">
            <div className="col s12 l8">
              <Plan readonly={true} {...this.props} />
            </div>
            <div className="col s12 l4">
              <div className="total-section">
                <Totals store={store} />
                {!mobile && <SummaryUser store={store} />}
                <div className="link-area">
                  <EmailPlanButton store={store} onError={this.onError} onDone={this.onDone}>{'Email me this plan'}</EmailPlanButton>
                  {done && <div className="submit-message submit-success">{done}</div>}
                  {error && <div className="submit-message submit-error">{error.toString()}</div>}
                  <RequestConsult />
                </div>
              </div>
            </div>
          </div>
          <BackLink to="/plan" title="Edit Plan">Edit plan</BackLink>
        </div>
      </div>
    );
  }
}

module.exports = Summary;