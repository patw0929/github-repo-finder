import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import { getRepo } from '../../actions';

class DetailView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal: false,
    };
  }

  handleClick() {
    this.setState({
      isShowingModal: true,
    });
  }

  handleClose() {
    this.setState({
      isShowingModal: false,
    });
  }

  render() {
    return (
      <button type="button"
        className="detail-btn btn btn-default btn-sm"
        onClick={() => {this.handleClick()}}>
        <span className="glyphicon glyphicon-search" aria-hidden="true"></span> Detail
      {
        this.state.isShowingModal &&
        <ModalContainer onClose={() => {this.handleClose()}}>
          <ModalDialog onClose={() => {this.handleClose()}}>
            <div className="detail-view">
              <h1>{this.props.name}</h1>
              <p>{this.props.description}</p>
            </div>
          </ModalDialog>
        </ModalContainer>
      }
      </button>
    );
  }
}

function mapStateToProps(state) {
  return {
    repo: state.repo,
  };
}

export default connect(mapStateToProps, { getRepo })(DetailView);
