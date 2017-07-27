import axios from 'axios';

const ADVISOR_EMAIL = 'advisor@movementvote.org';

const _do_email = ({payload,url,successMsg,stringify=true}) => {

    const opts = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      credentials: 'same-origin',
      body: stringify ? JSON.stringify (payload) : payload
    };

    const errMsg = `'Error: We were unable to send your message at this time. Please try again later or email ${ADVISOR_EMAIL} directly.'`;

    return axios (`${location.origin}/${url}`, opts)
      .then( resp => resp.json() )
      .then( resp => {
        // this is a gmail api thing
        if( resp.labelIds && resp.labelIds.includes('SENT') ) {
          return successMsg;            
        } else {
          throw new Error(errMsg);
        }
      }).catch( () => {
          throw new Error(errMsg);
      });

};

const houseParty = ( payload ) => {

  const args = {
    payload, 
    stringify:  false,
    url:        '/api/houseparty',  
    successMsg: 'Thank you! Your house party information has been sent successfuly.'
  };

  return _do_email( args );
};

const emailContact = ({ user, message }) => {

    const payload = {
      ...user,
      advisorEmail: ADVISOR_EMAIL,
      message
    };

    const args = {
      payload,
      url: 'api/contact',
      successMsg: 'Thank you! Your message has been sent successfuly.'
    };

    return _do_email(args);

};

const emailPlan = ({ user, plan, forceConsult = false }) => {

    let {
        donations: items,
        total: planTotal
      } = plan;

    forceConsult && (user = { ...user, wantsConsult: true });

    const payload = {
      ...user,
      advisorEmail: ADVISOR_EMAIL,
      items,
      planTotal
    };

    const args = {
      payload,
      url: 'api/contact',
      successMsg: 'Thank you! Your plan is on the way.'
    };

    return _do_email( args );
};

module.exports = {
  emailPlan,
  emailContact,
  houseParty
};
