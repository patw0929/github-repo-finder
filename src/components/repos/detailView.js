import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import TagForm from './tagForm';
import TagList from './tagList';
import { getRepo, getStarStatus, toggleStar, cleanRepo } from '../../actions';

class DetailView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal: false,
    };
  }

  handleClick() {
    const { owner, name } = this.props;
    this.props.getRepo(owner, name);
    this.props.getStarStatus(owner, name);

    this.setState({
      isShowingModal: true,
    });
  }

  handleClose() {
    this.setState({
      isShowingModal: false,
    });
    this.props.cleanRepo();
  }

  handleStar(bool) {
    const { owner, name } = this.props;
    this.props.toggleStar(owner, name, bool);
  }

  render() {
    const starred = this.props.repo.starred;
    const tags = this.props.repo.tags;

    return (
      <button type="button"
        className="detail-btn btn btn-default btn-sm"
        onClick={() => {this.handleClick()}}>
        <span className="glyphicon glyphicon-search" aria-hidden="true"></span> Detail
      {
        this.state.isShowingModal &&
        <ModalContainer onClose={() => {this.handleClose()}}>
          <ModalDialog style={{width: '80%'}} onClose={() => {this.handleClose()}}>
            <div className="detail-view">
              <button type="button"
                className="detail-btn btn btn-default btn-sm"
                onClick={() => {this.handleStar(!starred)}}>
                <span className="glyphicon glyphicon-star"
                  aria-hidden="true"></span> { starred ? 'Unstar' : 'Star' }
              </button>

              <h1>{this.props.repo.data.name}</h1>

              <div className="detail-description">
                <p>{this.props.repo.data.description}</p>
              </div>

              <hr />

              <TagList tags={tags.public} type="public" />

              <TagList tags={tags.private} type="private" />

              <TagForm />
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
    cleanRepo,
  })(DetailView);
