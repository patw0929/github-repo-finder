import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

class TagForm extends Component {
  constructor(props) {
    super(props);
  }

  onSubmit({ tag, isPublic }) {
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
              <input {...tag} type="text"
                maxLength="10" className="form-control" />
              <div className="help-block">
                {tag.touched ? tag.error : ''}
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
