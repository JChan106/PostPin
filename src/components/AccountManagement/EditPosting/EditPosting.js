import React from 'react';
import style from './EditPosting.scss';
import { ReactTextField, validator  } from 'react-textfield';
import Button from './../../Button';
import { Link, Prompt } from 'react-router-dom';
import ImageUploader from 'react-images-upload';
import firebase from './../../../firebase.js';

const style1 = {
  container: {
    textAlign: 'left',
  },
  input: {
    //width: '700px',
    width: '100%',
    fontSize: '14px',
  },
  successMessage: {
    fontSize: '10px',
    color: '#3949AB',
  },
  errorMessage: {
    fontSize: '10px',
    color: '#E91E63',
  },
};

/**
 * UI Component
 * @type {Class}
 */
class EditPosting extends React.Component {
  /**
   * Constructor for UI Component
   * @param  {Object} props  Props passed to this class
   * @return {void}
   */
  constructor (props) {
    super(props);
    this.state = {
      canSubmit: false,
      pictures: [],
      showError: false,
      titlein: '',
      pricein: '',
      descriptionin: '',
      tagsin: '',
      postnumber:''
    };
    this.checkSubmit = this.checkSubmit.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.rejectSubmit = this.rejectSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onDrop(picture) {
    if (picture) {
      this.setState({
        pictures: this.state.pictures.concat(picture)
      });
      setTimeout(() => {
        let elementtoscroll = document.querySelectorAll('div[class="uploadPictureContainer"]')[document.querySelectorAll('div[class="uploadPictureContainer"]').length - 1];
        elementtoscroll.scrollIntoView({behavior: 'smooth'});
      }, 50);
    }
  }

    handleChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }


   checkSubmit () {
    document.querySelector('span[class="ReactTextField-message ReactTextField--error"]')
     ? this.setState({canSubmit: false})
     : this.setState({canSubmit: true, showError: false})
   }

   rejectSubmit () {
     return this.setState({showError: true});
   }

   handleSubmit(e) {
     e.preventDefault();
    var that = this;
    let _title = document.querySelector('input[name="Title"]').value != '' ? document.querySelector('input[name="Title"]').value : document.querySelector('input[name="Title"]').placeholder;
    let _price = document.querySelector('input[name="Price"]').value != '' ? document.querySelector('input[name="Price"]').value : document.querySelector('input[name="Price"]').placeholder;
    let _description = document.querySelector('input[name="Body"]').value != '' ? document.querySelector('input[name="Body"]').value : document.querySelector('input[name="Body"]').placeholder;
    let _tag = document.querySelector('input[name="Tags"]').value != '' ? document.querySelector('input[name="Tags"]').value : document.querySelector('input[name="Tags"]').placeholder;
    let _school = sessionStorage.getItem("schoolName");
    let _pictures = this.state.pictures;
    let user = firebase.auth().currentUser;
      if (user) {
        console.log("user is: " + user.email);
        var postnum;
        let postingID = JSON.parse(sessionStorage.getItem("postEdit")).postID;
        //firebase.database().ref('users/' + user.uid).update({Posts: postnum});
        firebase.database().ref('users/' + user.uid + '/posts/' + postingID).update({title: _title, price: _price, description: _description, tag: _tag, school:_school});

      }
      else {
        console.log("user does not exists")
      }
     });

     this.setState({
       titlein: document.querySelector('input[name="Title"]').value,
       pricein: document.querySelector('input[name="Price"]').value,
       descriptionin: document.querySelector('input[name="Body"]').value,
       tagsin: document.querySelector('input[name="Tags"]').value
     });
   }

  /**
   * Render function for UIComponent Component
   * @return {JSX} Component to render
   */
  render () {
    const priceValidator = [
        {
          message: 'Price must be a number',
          validator: value => !isNaN(value)
        },
        {
          message: '*Required',
          validator: value => value.replace(/\s+/, "")  != ''
        }
    ];

    const emptyValidator = [
        {
          message: '*Required',
          validator: value => value.replace(/\s+/, "")  != ''
        },
    ];

    return (
      <div className={style.container}>

        <div className = {style.title}>
          Title
          <ReactTextField
            name="Title"
            type="text"
            validators={emptyValidator}
            placeholder={JSON.parse(sessionStorage.getItem("postEdit")).title}
            style = {style1}
            onChange={this.handleChange}
            value = {this.state.titlein}
            afterValidate={this.checkSubmit}
          />
        </div>

        <div className={style.price}>
          Price ($)
          <ReactTextField
            name="Price"
            type="text"
            validators={priceValidator}
            placeholder={JSON.parse(sessionStorage.getItem("postEdit")).price}
            style = {style1}
            onChange={this.handleChange}
            value = {this.state.pricein}
            afterValidate={this.checkSubmit}
          />
        </div>

        <div className={style.description}>
          Description
          <ReactTextField
            name="Body"
            type="text"
            validators={emptyValidator}
            placeholder={JSON.parse(sessionStorage.getItem("postEdit")).des}
            style = {style1}
            onChange={this.handleChange}
            value = {this.state.descriptionin}
            afterValidate={this.checkSubmit}
          />
        </div>

        <div className={style.tags}>
          Insert tags separated by commas
          <ReactTextField
            name="Tags"
            type="text"
            placeholder={JSON.parse(sessionStorage.getItem("postEdit")).tags}
            onChange={this.handleChange}
            value = {this.state.tagsin}
            style = {style1}
          />
        </div>

        <div className={style.upload}>
          <ImageUploader
                  withPreview={true}
                  withIcon={true}
                  buttonText='Choose images'
                  onChange={this.onDrop}
                  imgExtension={['.jpg', '.gif', '.png', '.gif']}
                  maxFileSize={5242880}
                  label='Max file size: 5mb, Accepted: jpg, gif, png, gif'
            />
          </div>

        <div className={style.submit} onClick={this.handleSubmit}>
          {this.state.showError ? <div className={style.error}> Errors Exist on Page </div> : null}
          <Link to={this.state.canSubmit ? "/some/where/edit" : "/some/where/AccountManagement"}>
            <Button buttonText="Submit" />
          </Link>
        </div>
        <div className={style.back}>
          <Link to="/some/where/AccountManagement">
            <Button buttonText="Cancel" />
          </Link>
        </div>
      </div>
    );
  }
}

export default EditPosting;
