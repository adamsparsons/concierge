
import {
  ContentPage
} from '../../client/main/components';

import service from '../m-service';


const AboutModel = {
  
  paths: [ '/about'  ],

  component: ContentPage,
  
  model: () => service.getPage('about').then( page => { 
    return {
      page,
      pageName: 'about',      
    };
  }),

  title: 'About',

  meta: [
    { 
      name: 'description',
      content: 'Our group provides tools for activists and donors to connect with hundreds of grassroots vote groups across the United States' 
    },
    {
      name: 'keywords',
      content: 'about, grassroots, movement-2017'
    }
  ]
};

module.exports = AboutModel;