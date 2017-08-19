import serialize from 'serialize';

class Testimonial extends serialize.Model {
  constructor() {
    super(...arguments);
    this.idBinding = 'ID';
    this.bodyBinding = 'post_content';
    this.authorBinding = 'post_title';
    this.slugBinding = 'post_name';
    this.titleBinding = 'fields.author_title';
    this.imageBinding = 'fields.image';
  }
}

class Menu extends serialize.Model {
  constructor() {
    super(...arguments);
    this.getId = () => this.ID || this.term_id;

    this.labelBinding = 'label';
    this.getParent = () => Number(this.parent);
    this.orderBinding = 'order';
    this.urlBinding = 'url';
  }
}


class PostBare extends serialize.Model {
  constructor() {
    super(...arguments);
    this.idBinding = 'ID';
    this.bodyBinding = 'post_content';
    this.titleBinding = 'post_title';
    this.slugBinding = 'post_name';
  }
}

class Post extends PostBare {
  constructor() {
    super(...arguments);
    for( var key in this.fields ) {
      this[ key + 'Binding'] = 'fields.' + key;
    }
  }
}

class DonateTiles extends Post {
}

class News extends PostBare {
  constructor() {
    super(...arguments);
    this.imageBinding = 'fields.image';
    this.getCategory = () => this.fields.category[0];
  }
}

class TaxonomyNode extends serialize.Model {
  constructor() {
    super(...arguments);
    this.idBinding = 'term_id';
    this.nameBinding = 'name';
    this.slugBinding = 'slug';
  }
}

class States extends TaxonomyNode {
  constructor() {
    super(...arguments);
    this.descriptionBinding = 'description';
    this.parentBinding = 'parent';
    this.getCount = () => {
      if( this.parent === 0 ) {
        return this._ctx.states
                            .filter( state => state.parent === this.term_id )
                            .reduce( (counts,state) => counts + state.count, 0 );
      } else {
        return this.count;
      }     
    };

    if( this.parent === 0 ) {
      this.getOrder = () => this._ctx.order.indexOf( this.slug );
    }
  }

}

class Tags extends TaxonomyNode {
  constructor() {
    super(...arguments);
    this.categoryBinding = 'category';
    this.countBinding = 'count';
  }
}

class Advisor extends serialize.Model {
  constructor() {
    super(...arguments);
    this.nameBinding = 'post_title';
    this.idBinding = 'post_name';
    this.getSort = () => this.post_name.split('-').pop();
  }
}

class Groups extends PostBare {

  constructor() {
    super(...arguments);

    if( this.fields ) {
      this.websiteBinding  = 'fields.website';
      this.c4_donate_link  = 'fields.c4_donate_link';
      this.c3_donate_link  = 'fields.c3_donate_link';
      this.pac_donate_link = 'fields.pac_donate_link';
      this.image           = 'fields.image';      
    }

    this.getState = () => this.fields
                            ? this._ctx.taxonomies.state.terms[ this.fields.state[0] ].term_id
                            : this._ctx.taxonomies.state.terms[ 'national' ].term_id;

    this.getTags = () => {
      
      if( !this.fields ) {
        return [];
      }

      const {
        taxonomies: tax,
        tagCatKeys
      } = this._ctx;

      const tags = [];
      tagCatKeys.forEach( cat => ((this.fields[cat] || []).forEach( tag => tags.push(tax[cat].terms[tag].term_id) ) ) );
      return tags;

    };
  }
}

const _preserialize = db => {

  const tax = db.taxonomies;

  const tagCats = {
    'issue-area':     { id: 1, tag: true },
    constituency:     { id: 2, tag: true },
    'nonprofit-type': { id: 3, tag: false } 
  };

  const tagCatKeys = Object.keys(tagCats);

  // Utilities for tags
  const toArr = key => Object.keys(tax[key].terms).map( term => tax[key].terms[term] );

  const tagReducer = (accum, key) => [ ...accum, ...toArr(key).map( tag => ({ ...tag, category: tagCats[key].id })) ];

  tagCatKeys.forEach( key => {
    tagCats[key].name = db.taxonomies[key].label;
    tagCats[key].slug = db.taxonomies[key].name;
  });

  return {
    states:        toArr('state'),
    tagCategories: tagCatKeys.map( key => ({ ...tagCats[key] }) ),
    tags:          tagCatKeys.reduce(tagReducer,[]),
    tagCatKeys
  };
};

const serializeContent = content => {

  try {

    const db = { ...content, ..._preserialize(content) };

    return {
      advisors:      serialize({ jsonData: db.posts.advisor,     model: Advisor }),
      donateTiles:   serialize({ jsonData: db.posts.donatetile,  model: DonateTiles }),
      news:          serialize({ jsonData: db.posts.news,        model: News }),
      menu:          serialize({ jsonData: db.menu,              model: Menu }),
      tags:          serialize({ jsonData: db.tags ,             model: Tags } ),
      testimonials:  serialize({ jsonData: db.posts.testimonial, model: Testimonial }),
      states:        serialize({ jsonData: db.states,            model: States,        ctx: { states: db.states, order: db.colorOrder} }),
      groups:        serialize({ jsonData: db.posts.group,       model: Groups,        ctx: { taxonomies: db.taxonomies, tagCatKeys: db.tagCatKeys }} ),

      tagCategories: db.tagCategories
    };
    
  } catch( e ) {
    console.log( 'ERROR DURING SERALIZE: ', e ); // eslint-disable-line no-console
  }
};


module.exports = serializeContent;


