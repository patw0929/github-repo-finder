import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import { getRepo, getStarStatus, toggleStar } from '../../actions';

class DetailView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal: false,
    };
  }

  handleClick() {
    const { owner, name } = this.props;
    this.props.getStarStatus(owner, name);

    this.setState({
      isShowingModal: true,
    });
  }

  handleClose() {
    this.setState({
      isShowingModal: false,
    });
  }

  handleStar(bool) {
    const { owner, name } = this.props;
    this.props.toggleStar(owner, name, bool);
  }

  render() {
    const { name, description } = this.props.repo.data;
    const starred = this.props.repo.starred;

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


              <button type="button"
                className="detail-btn btn btn-default btn-sm"
                onClick={() => {this.handleStar(!starred)}}>
                <span className="glyphicon glyphicon-star"
                  aria-hidden="true"></span> { starred ? 'Unstar' : 'Star' }
              </button>
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

export default connect(mapStateToProps,
  {
    getRepo,
    getStarStatus,
    toggleStar,
  })(DetailView);
