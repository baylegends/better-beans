import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import BeanSelected from './BeanSelected';
import axios from 'axios';

export default function CreateReview() {
  const [body, setBody] = useState('');
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);

  const CREATE_REVIEW = gql`
    mutation CreateReview(
      $name: String!
      $body: String!
      $rating: Int
      $shop_id: String!
      $user_id: String!
    ){
      createReview(
        name: $name
        body: $body
        rating: $rating
        shop_id: $shop_id
        user_id: $user_id
      ) {
        id
      }
    }
  `;

  const CREATE_PHOTO = gql`
    mutation CreatePhoto(
      $review_id: Int!
      $url: String!
    ) {
      createPhoto(
        review_id: $review_id
        url: $url
      )
    }
  `;

  const [createReview, { data, loading, err }] = useMutation(CREATE_REVIEW);

  if (loading) return 'Submitting...';
  if (err) return `Submission error! $${err.message}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    createReview({
      variables: {
        name: 'Qinyu for you',
        body: 'i like coffee',
        rating: 5,
        shop_id: 'Simple',
        user_id: 'user id',
      },
    })
      // .then((res) => {
      //   photos.map((photo) => {
      //     photo[review_id] = res.createReview.review_id,
      //   });
      //   console.log(res.createReview);
      // });
    // .then((result) => console.log('Created review:', result));
  };

  const handleImage = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      const selectedFileArray = Array.from(e.target.files);
      setFiles(prevFile => prevFile.concat(selectedFileArray));
      setPhotos(prevImg => prevImg.concat(fileArray));
      Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
    }
  };

  const renderImg = (source) => {
    return source.map(image => {
      return <img src={image} key={image} height="80" id="upload-image" onClick = {handleAPI}></img>;
    });
  };

  // transfer photos to URL
  const handleAPI = () => {
    let URLs = [];
    for (let i = 0; i < files.length; i++) {
      let formData = new FormData();
      formData.append('file', files[i]);
      formData.append('upload_preset', 'asosdlts');

      axios.post('https://api.cloudinary.com/v1_1/dkw2yrk06/upload', formData)
        .then((data) => {
          URLs.push({url: data.data.secure_url});
          if (URLs.length === files.length) {
            console.log(URLs);
          }
        })
        .catch((err) => console.log('tranfer URL err', err));
    }
  }

  return (
    <div id="create-review">
      <form onSubmit={(e) => { handleSubmit(e); }}>
        <div id="select-your-rating">Select your rating.</div>
        <div id="select-beans">
          <BeanSelected />
        </div>
        <div id="write-review">Write your reviews...</div>
          <textarea
            id="write-review-input"
            onChange={(e) => {e.preventDefault(); setBody(e.target.value)}}
            />
          <input
            id="input-photo-review"
            type='file'
            multiple={true}
            onChange={(e) => handleImage(e)}>
          </input>
        <div>{renderImg(photos)}</div>
        <button id="submit-review-btn" type="submit"> Submit Review</button>
      </form>
    </div>
  );
}

/*
right now => photos = ['url1', 'url2'];

need to be this => photos = [
  {
    review_id: res.review_id,
    url: 'url1',
  },
  {
    review_id: res.review_id,
    url: 'url2',
  },
]
for (let i = 0; i < photos.length; i++) {
  photos[i][review_id] = res.review_id
}
*/

// photos = [
//   { url: 'url1' },
//   { url: 'url2' },
// ];
