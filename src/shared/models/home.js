
import {
  HomePage
} from '../../client/components';

import service from '../services/m-service';

const HomePageModel = {

  paths: [ '/' ],

  component: HomePage,

  title: 'Home',

  model: () => {

    let props = {};
    return service.db.then( db => {

      props = {
        donateTiles:  db.query('donateTiles'),
        news:         db.query('news'),
        testimonials: db.query('testimonials'),
        states:       db.denormalizedStates
       };

      return service.getPage('home');

    }).then( homePage => {

      props.page = homePage;

      return props;
    });
  }
};

module.exports = HomePageModel;
