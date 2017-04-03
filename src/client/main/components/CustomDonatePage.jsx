import React     from 'react';
import TagString from 'tag-string';
import { browserHistory } from 'react-router';
import Sticky from 'react-stickynode';

import OrgList  from './OrgList';
import Filters  from './Filters';
import Tray     from './ShoppingCart/Tray.jsx';
import EasyDonateTiles    from './EasyDonateTiles.jsx';
import Loading  from './Loading.jsx';

import { ContextMixin } from './ContextMixins';

import { setVisibility } from '../store/actions';
import scrollToElement from '../../lib/scrollToElement';

import {
  getVisibleOrgs,
  getVisibleStates
} from '../store/utils';

class CustomDonatePage extends ContextMixin(React.Component) {

  constructor() {
    super(...arguments);
    const storeState = this.context.store.getState();
    this.state = {
      selectedTerms: storeState.groups.visibility,
      loading: true,
      showOrgs: false
    };
    this.onShowElement  = this.onShowElement.bind(this);
    this.onTermsChecked = this.onTermsChecked.bind(this);
  }

  componentDidMount() {
    const SHOW_ORGS_DELAY = 10;

    setTimeout( () => this.setState({ showOrgs: true }), SHOW_ORGS_DELAY);
  }

  stateFromStore(storeState) {
    const _handleOrgs = orgs => {
      const {
        groups: {
          visibility
        }
      } = storeState;

      this.setState( {
        selectedTerms: visibility,
        orgs: getVisibleOrgs( orgs, visibility ),
        loading: false
      });
    };

    const value = storeState.service.cachedValue('orgs');

    if( value ) {
      _handleOrgs(value);
    } else {
      storeState.service.orgs.then( _handleOrgs );
    }
  }

  onShowElement(element) {
    const {
      params:{ mobile = ''} = {}
    } = this.props;

    if( mobile ) {
      browserHistory.push( '/state/' + element );
    } else {
      browserHistory.push('/groups#' + element);
      const SCROLL_DELAY = 100;
      scrollToElement('#' + element, SCROLL_DELAY);
    }
  }

  onTermsChecked(cat, terms, toggle) {
    const tags = terms && terms.length
                  ? TagString.fromArray( this.state.selectedTerms[cat] ).toggle(terms,toggle).toArray()
                  : [];
    this.context.store.dispatch( setVisibility( cat, tags ) );
  }

  render() {
    const {
      selectedTerms,
      orgs,
      loading,
      showOrgs
    } = this.state;

    if( loading ) {
      return <Loading />;
    }

    const {
      params:{ mobile = ''} = {}
    } = this.props;

    const fprops = {
      onShowElement:   this.onShowElement,
      onTermsChecked:  this.onTermsChecked,
      selected:        selectedTerms,
      visibleSections: Object.keys(orgs),
      visibleStates:   getVisibleStates(orgs),
      mobile
    };

    const title = 'Browse Groups';

    return (
      <main className={`browse-groups-page ${mobile}`}>
        <div className="container browse-groups-container">
          <h1 className="page-title">{title}</h1>
          {showOrgs
            ?
              <div className="browse-section">
                <div className="filter-area-wrapper">
                  <Sticky top={104} bottomBoundary=".browse-groups-container">
                    <Filters {...fprops} />
                  </Sticky>
                </div>
                <OrgList mobile={mobile} orgs={orgs} />

                <div className="plan-sidebar-wrapper">
                  <Sticky top={104} bottomBoundary=".browse-groups-container">
                    <div className="plan-sidebar">
                      <Tray />
                      <EasyDonateTiles />
                    </div>
                  </Sticky>
                </div>
              </div>
            : <Loading />
          }
        </div>
        <div className="bottom-spacer" />
      </main>
    );
  }
}

/*

*/
module.exports = CustomDonatePage;
