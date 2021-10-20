import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

export default function CreateReview() {
  const [body, setBody] = useState('');
  const [photos, setPhotos] = useState([]);

  const CREATE_REVIEW = gql`
    mutation CreateReview(
      $first_name: String!
      $title: String
      $body: String!
      $rating: Int
      $shop_id: String!
      $user_id: Int!
    ){
      createReview(
        first_name: $first_name
        title: $title
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
        first_name: 'Qinyu for you',
        title: 'very yummy coffee!',
        body: 'i like coffee',
        rating: 5,
        shop_id: 'Simple',
        user_id: 1,
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
      let file = Array.from(e.target.files);
      setPhotos(prevPhoto => prevPhoto.concat(file));
    }
  };

  return (
    // the modal component should be adding option
    <div>
      <div id="review">
        <form onSubmit={(e) => { handleSubmit(e); }}>
          <label>
            Write your reviews down
          </label>
          <br />
          <label>
            Your photos(optional)
          </label>
          <br />
          <button type="submit"> Submit Review</button>
        </form>
      </div>
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
