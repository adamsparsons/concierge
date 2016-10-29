import React         from 'react';

import ProfileInput  from './Profile/Input.jsx';


class ContactForm extends React.Component {

  constructor() {
    super(...arguments);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.refs.message.value);
  }
  
  render() {
    const { submitText = 'Submit' } = this.props;

    return (
        <div className="plan-form profile-form">
          <h3>Send a Message</h3>
          <form className="user-info" onSubmit={this.onSubmit}>
            <div className="row">
              <div className="col s12 m6">
                <ProfileInput name="fname" placeholder="First Name" /> 
              </div>
              <div className="col s12 m6">
                <ProfileInput name="lname" placeholder="Last Name"  /> 
              </div>
            </div>
            <div className="row">
              <div className="col s12 m6">
                <ProfileInput name="email" placeholder="Email *" required />
              </div>
              <div className="col s12 m6">
                <ProfileInput name="phone" placeholder="Phone" /> 
              </div>
            </div>
            <div className="row">
              <textarea ref="message" name="message" placeholder="your message here" />
            </div>
            <div className="action-area"> 
              <button id="profile-form-submit" className="waves-effect waves-light btn" type="submit">{submitText}</button>
            </div>
          </form>
        </div>
      );
  }
}

module.exports=ContactForm;

