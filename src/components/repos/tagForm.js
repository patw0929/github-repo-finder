import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { postTags } from '../../actions';

class TagForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      isPublic: true,
    };
  }

  clearInput() {
    this.setState({tags: []});
  }

  handleChange(tags) {
    this.props.fields.tags.onChange(tags);
    this.setState({tags});
  }

  handleCheck(e) {
    this.setState({
      isPublic: e.target.checked ? true : false,
    });
  }

  onSubmit({ tags, isPublic }) {
    const repo = this.props.repo.data.full_name;
    tags = _.uniq(tags);

    for (let i = 0, max = tags.length; i < max; i++) {
      this.props.postTags(repo, tags[i], (this.state.isPublic ? true : false));
    }

    this.clearInput();
    this.props.resetForm();
  }

  render() {
    const { handleSubmit, fields: { tags, isPublic } } = this.props;

    return (
      <div className="tag-form-wrapper">
        <form className="tag-form form-horizontal"
          onSubmit={handleSubmit(this.onSubmit.bind(this))} noValidate>
          <div className={`form-group ${tags.touched && tags.invalid ? 'has-error' : ''}`}>
            <label htmlFor="tag" className="col-xs-1 control-label">Tags:</label>
            <div className="col-xs-11">
              <TagsInput value={this.state.tags}
                onChange={this.handleChange.bind(this)}
                className="react-tagsinput tag-form__tags"
                onlyUnique={true}
                maxTags={10}
                addOnBlur={true}
                addKeys={[9, 13, 32]}
              />
              <input {...tags} type="hidden" value={this.state.tags} />
              <div className="help-block">
                {tags.touched ? tags.error : ''}
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="col-xs-offset-1 col-xs-11">
              <div className="checkbox">
                <label>
                  <input {...isPublic} type="checkbox"
                    value="1"
                    checked={this.state.isPublic}
                    onChange={(e) => {this.handleCheck(e)}} /> Public Tag
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="col-xs-offset-1 col-xs-11">
              <button type="submit"
                className="btn btn-primary">Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function validate(fields) {
  const errors = {};

  if (!fields.tags) {
    errors.tags = 'Tag field is required.';
  }

  return errors;
}

function mapStateToProps(state) {
  return {
    user: state.user,
    repo: state.repo,
  };
}

export default reduxForm({
  form: 'tagForm',
  fields: ['tags', 'isPublic'],
  validate,
}, mapStateToProps, { postTags })(TagForm);
