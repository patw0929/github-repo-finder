import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

class TagForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
    };
  }

  clearInput() {
    this.setState({tags: []});
  }

  handleChange(tags) {
    this.props.fields.tag.onChange(tags);
    this.setState({tags});
  }

  onSubmit({ tag, isPublic }) {
    console.log(tag, isPublic);
    this.clearInput();
    this.props.resetForm();
  }

  render() {
    const { handleSubmit, fields: { tag, isPublic } } = this.props;

    return (
      <div className="tag-form-wrapper">
        <form className="tag-form form-horizontal"
          onSubmit={handleSubmit(this.onSubmit.bind(this))} noValidate>
          <div className={`form-group ${tag.touched && tag.invalid ? 'has-error' : ''}`}>
            <label htmlFor="tag" className="col-xs-1 control-label">Tag:</label>
            <div className="col-xs-11">
              <TagsInput value={this.state.tags}
                onChange={this.handleChange.bind(this)}
                className="react-tagsinput tag-form__tags"
              />
              <input {...tag} type="hidden" value={this.state.tags} />
              <div className="help-block">
                {tag.touched ? tag.error : ''}
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="col-xs-offset-1 col-xs-11">
              <div className="checkbox">
                <label>
                  <input {...isPublic} type="checkbox" value="1" /> Public Tag
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

  if (!fields.tag) {
    errors.tag = 'Tag field is required.';
  }

  return errors;
}

export default reduxForm({
  form: 'tagForm',
  fields: ['tag', 'isPublic'],
  validate,
})(TagForm);
