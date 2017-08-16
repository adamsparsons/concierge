import React         from 'react';
import { connect }   from 'react-redux';
import { emailPlan } from '../../services/email';
import ActionButton  from './ActionButton.jsx';

class _EmailPlanButton extends React.Component {

  onEmail = (e) => {
    e.preventDefault();

    const {
      onError,
      onDone,
      profile:user,
      plan
    } = this.props;

    emailPlan( { user, plan } )
      .then( done => onDone(done) )
      .catch( err => onError(err) );
  }

  render() {
    const { text, children } = this.props;
    return <ActionButton onClick={this.onEmail}>{text}{children}</ActionButton>;
  }
}

const mapStateToProps = ({plan,profile}) => ({ plan, profile });

const EmailPlanButton = connect(mapStateToProps)(_EmailPlanButton);

module.exports = EmailPlanButton;
