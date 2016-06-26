import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

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

  renderMsg() {
    if (this.props.authenticated) {
      return (
        <p>
          If you already login but not redirect automatically,
          please <Link to="/repos">click here</Link> to the repos page.
        </p>
      );
    }

    return (
      <div>
        <p>Please login first.</p>

        <div className="well">
          <p>這是個人練習的小專案，並也希望做個小工具，解決臨時想找個曾經看過的 GitHub 專案但熊熊又想不起來的窘境。（年紀漸長，該吃銀杏了）</p>

          <p>這個小專案能為這些專案下個 tag，或是看看別人下的 tag，往後要尋找就更能有跡可循。</p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderMsg()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.authenticated,
  };
}

export default connect(mapStateToProps)(Welcome);
