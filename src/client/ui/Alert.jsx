import React from 'react';

class Alert extends React.Component {

  constructor() {
    super(...arguments);
    this.state = {
      ...this.props,
      showing: true
    };
    this._toggleShow = this._toggleShow.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState( { ...props, showing: true } );
  }

  _toggleShow(e) {
    const { onClose } = this.props;
    e.preventDefault();
    this.setState({showing:false});
    onClose && onClose();
  }

  render() {
    const {
      showing,
      type = 'warning',
      msg,
      className = ''
    } = this.state;

    return showing && msg && (
        <div className={`alert alert-${type} ${className}`} onClick={this._toggleShow} >
          {msg}
          <a href="#" className="btn-floating waves-effect waves-light" onClick={this._toggleShow}  dangerouslySetInnerHTML={{__html:'&times;'}} />
        </div>
      );
  }
}

Alert.INFO = 'info';
Alert.SUCCESS = 'success';
Alert.WARNING = 'warning';
Alert.DANGER = 'danger';

module.exports = Alert;