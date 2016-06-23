import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../actions';

class Repo extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (this.props.token) {
      this.props.getUser(this.props.token);
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.token) {
      this.props.getUser(this.props.token);
    }
  }

  render() {
    if (!this.props.token) {
      return (
        <div>Please login first.</div>
      );
    }

    const { login, name } = this.props.user;
    console.log(this.props.user);

    return (
      <div>
        Hello {name}!
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.token,
    user: state.user,
  };
}

export default connect(mapStateToProps, { getUser })(Repo);
