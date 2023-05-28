import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { MDBDataTable } from "mdbreact";
import Loader from "../layout/Loader";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  getRoomReviews,
  deleteReview,
  clearErrors,
} from "../../redux/actions/roomActions";
import { DELETE_REVIEW_RESET } from "../../redux/constants/roomConstants";

const RoomReviews = () => {
  const [roomId, setRoomId] = useState("");

  const dispatch = useDispatch();

  const { loading, error, reviews } = useSelector((state) => state.roomReviews);
  const { error: deleteReviewError, isDeleted } = useSelector(
    (state) => state.review
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteReviewError) {
      toast.error(deleteReviewError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Review deleted successfully.");
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [dispatch, error, deleteReviewError, isDeleted]);

  const setReviews = () => {
    const data = {
      columns: [
        {
          label: "Review Id",
          field: "id",
          sort: "asc",
        },
        {
          label: "Rating",
          field: "rating",
          sort: "asc",
        },
        {
          label: "Comment",
          field: "comment",
          sort: "asc",
        },
        {
          label: "User",
          field: "user",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    reviews &&
      reviews.forEach((review) => {
        data.rows.push({
          id: review._id,
          rating: review.rating,
          comment: review.comment,
          user: review.name,
          actions: (
            <>
              <button
                className="btn btn-danger mx-2"
                onClick={() => handleReviewDelete(review._id)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </>
          ),
        });
      });

    return data;
  };

  const handleReviewDelete = (reviewId) => {
    dispatch(deleteReview(roomId, reviewId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(getRoomReviews(roomId));
  };

  return (
    <div className="container container-fluid">
      <div className="row justify-content-center mt-5">
        <div className="col-12 col-md-6 text-center mt-4">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="roomId_field">Enter Room Id</label>
              <input
                type="text"
                id="roomId_field"
                className="form-control"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="mt-2 btn text-white new-room-btn"
              onClick={handleSubmit}
            >
              get reviews
            </button>
          </form>
        </div>
      </div>

      {reviews && reviews.length > 0 ? (
        <>
          <h1 className="my-5">{`${reviews && reviews.length} Reviews`}</h1>
          <MDBDataTable
            data={setReviews()}
            className="px-3"
            bordered
            striped
            hover
          />
        </>
      ) : (
        <div className="alert alert-danger mt-5 text-center">No Reviews</div>
      )}
    </div>
  );
};

export default RoomReviews;
