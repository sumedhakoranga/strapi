/**
 *
 *
 * InputFile
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { cloneDeep, isArray, isObject, isEmpty, last } from 'lodash';
import cn from 'classnames';

import ImgPreview from 'components/ImgPreview';
import InputFileDetails from 'components/InputFileDetails';

import styles from './styles.scss';

class InputFile extends React.Component {
  state = {
    isOpen: false,
    isUploading: false,
    position: 0,
  };

  addFilesToProps = (files) => {
    const value = Object.keys(files).reduce((acc, current) => {
      acc.push(files[current]);

      return acc;
    }, cloneDeep(this.props.value))

    const target = {
      name: this.props.name,
      type: 'file',
      value,
    };

    this.setState({ isUploading: !this.state.isUploading });
    this.props.onChange({ target });
  }

  handleChange = ({ target }) => this.addFilesToProps(target.files);

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.refs.inputFile.click();
  }

  onDrop = (e) => {
    e.preventDefault();
    this.addFilesToProps(e.dataTransfer.files);
  }

  updateFilePosition = (newPosition) => this.setState({ position: newPosition });

  render() {
    const {
      multiple,
      name,
      onChange,
      value,
    } = this.props;

    return (
      <div>
        <ImgPreview
          files={value}
          isUploading={this.state.isUploading}
          multiple={multiple}
          name={name}
          onChange={onChange}
          onBrowseClick={this.handleClick}
          onDrop={this.onDrop}
          updateFilePosition={this.updateFilePosition}
        />
        <label>
          <input
            className={styles.inputFile}
            multiple={multiple}
            name={name}
            onChange={this.handleChange}
            type="file"
            ref="inputFile"
          />

          <div className={styles.buttonContainer}>
            <i className="fa fa-plus" />
            <FormattedMessage id="app.components.InputFile.newFile" />
          </div>
        </label>
        <InputFileDetails
          isOpen={this.state.isOpen}
          number={value.length}
          onClick={() => { this.setState({ isOpen: !this.state.isOpen }) }}
          position={this.state.position}
        />
      </div>
    );
  }
}

InputFile.defaultProps = {
  multiple: true,
  value: [],
};

InputFile.propTypes = {
  multiple: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default InputFile;
