import React from 'react';

import {
  ContentPage,
  CustomDonatePage ,
  HouseParty       ,
  ContactPage      ,
  NotFoundPage     ,
  DonatePage       ,
  StatePage        ,
  AdvisorPage      ,
  SummaryPage      ,
  ConsultPage      ,
  ProfilePage      ,
} from '../client/main/components';

import ShoppingCart from '../client/main/components/ShoppingCart';

const contentPage = pageName => {
  const pageWrapper = props => <ContentPage page={props.page} pageName={pageName} />;
  pageWrapper.preloadPage = pageName;
  return pageWrapper;
};

const MeetTheTeamPage  = contentPage('team');
const AboutUsPage      = contentPage('about');
const TestimonialsPage = contentPage('testimonials');

var browserOnly = true;

const RouteMap = [
  {  path: '/donate',                component: DonatePage },

  // note: in react-router 4 we'll be able call matchPath to be smart about
  // parameter. For now we split it into 2 entries

  {  path: '/groups(/:mobile)'        , component: CustomDonatePage },

  {  path: '/plan'          , component: ShoppingCart, browserOnly }, 
  {  path: '/plan/summary'  , component: SummaryPage,  browserOnly }, 
  {  path: '/plan/profile'  , component: ProfilePage,  browserOnly }, 
  {  path: '/plan/consult'  , component: ConsultPage,  browserOnly }, 

  {  path: '/about'      , component: AboutUsPage }, 
  {  path: '/advisors'   , component: AdvisorPage }, 
  {  path: '/team'       , component: MeetTheTeamPage }, 

  {  path: '/getintouch' , component: ContactPage, browserOnly }, 
  {  path: '/houseparty' , component: HouseParty, browserOnly }, 

  // I think these are deprecated (not linked anywhere)
  {  path: '/state/:name'  , component: StatePage, browserOnly },   
  {  path: '/testimonials' , component: TestimonialsPage }, 

  {  path: '*' ,             component: NotFoundPage, browserOnly }, 
];

module.exports = RouteMap;