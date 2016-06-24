import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class Welcome extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    if (this.props.authenticated) {
      this.context.router.push('repos');
    }
  }

  componentWillUpdate() {
    if (this.props.authenticated) {
      this.context.router.push('repos');
    }
  }

  render() {
    return (
      <div>Please login first.</div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.authenticated,
  };
}

export default connect(mapStateToProps)(Welcome);
