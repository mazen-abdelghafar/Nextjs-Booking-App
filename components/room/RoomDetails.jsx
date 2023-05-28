import React, { useEffect, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors } from "../../redux/actions/roomActions";
import { Carousel } from "react-bootstrap";
import ButtonLoader from "../layout/ButtonLoader";
import NewReview from "../review/NewReview";

import { toast } from "react-toastify";
import RoomFeatures from "./RoomFeatures";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  checkBooking,
  getBookedDates,
} from "../../redux/actions/bookingActions";
import { CHECK_BOOKING_RESET } from "../../redux/constants/bookingConstants";

import { useRouter } from "next/router";
import axios from "axios";
import getStripe from "../../utils/getStripe";
import ReviewsList from "../review/ReviewsList";

const RoomDetails = () => {
  const [checkInDate, setCheckInDate] = useState();
  const [checkOutDate, setCheckOutDate] = useState();
  const [daysOfStay, setDaysOfStay] = useState();
  const [paymentLoading, setPaymentLoading] = useState(false);

  const { user } = useSelector((state) => state.loadUser);
  const { room, error } = useSelector((state) => state.roomDetails);
  const { available, loading: bookingLoading } = useSelector(
    (state) => state.checkBooking
  );
  const { dates } = useSelector((state) => state.bookedDates);

  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const excludedDates = [];
  dates.forEach((date) => {
    excludedDates.push(new Date(date));
  });

  useEffect(() => {
    dispatch(getBookedDates(id));

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    return () => {
      dispatch({ type: CHECK_BOOKING_RESET });
    };
  }, [dispatch, id, error]);

  const bookRoom = async (id, pricePerNight) => {
    setPaymentLoading(true);
    const amount = pricePerNight * daysOfStay;

    try {
      const link = `/api/checkout-session/${id}?checkInDate=${checkInDate.toISOString()}&checkOutDate=${checkOutDate.toISOString()}&daysOfStay=${daysOfStay}`;

      const { data } = await axios.get(link, { params: { amount } });

      const stripe = await getStripe();
      stripe.redirectToCheckout({ sessionId: data.session.id });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const onDateChange = (dates) => {
    const [checkInDate, checkOutDate] = dates;

    setCheckInDate(checkInDate);
    setCheckOutDate(checkOutDate);

    if (checkInDate && checkOutDate) {
      const days = Math.floor(
        (new Date(checkOutDate) - new Date(checkInDate)) / 86400000 + 1
      );
      setDaysOfStay(days);
      dispatch(
        checkBooking(id, checkInDate.toISOString(), checkOutDate.toISOString())
      );
    }
  };

  const handleNewBooking = async () => {
    const newBooking = {
      room: router.query.id,
      checkInDate,
      checkOutDate,
      daysOfStay,
      amountPaid: 90,
      paymentInfo: {
        id: "stripe_id",
        status: "stripe_status",
      },
    };

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post("/api/bookings", newBooking, config);
      console.log(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <>
      <Head>
        <title>{room.name} - BookIT</title>
      </Head>
      <div className="container container-fluid">
        <h2 className="mt-5">{room.name}</h2>
        <p>{room.address}</p>

        <div className="ratings mt-auto mb-3">
          <div className="rating-outer">
            <div
              className="rating-inner"
              style={{ width: `${(room.ratings / 5) * 100}%` }}
            ></div>
          </div>
          <span id="no_of_reviews">({room.numOfReviews} Reviews)</span>
        </div>

        <Carousel fade>
          {room.images &&
            room.images.map((image) => (
              <Carousel.Item key={image.public_id}>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "440px",
                  }}
                >
                  <Image
                    className="d-block m-auto"
                    src={image.url}
                    alt={room.name}
                    layout="fill"
                    priority={true}
                  />
                </div>
              </Carousel.Item>
            ))}
        </Carousel>

        <div className="row my-5">
          <div className="col-12 col-md-6 col-lg-8">
            <h3>Description</h3>
            <p>{room.description}</p>
            <RoomFeatures room={room} />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="booking-card shadow-lg p-4">
              <p className="price-per-night">
                <b>${room.pricePerNight}</b> / night
              </p>

              <hr />
              <h5 className="my-4">Pick Check In & Check Out Date</h5>

              <DatePicker
                className="w-100"
                selected={checkInDate}
                onChange={onDateChange}
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={new Date()}
                excludeDates={excludedDates}
                selectsRange
                inline
              />

              {available === true && user && (
                <div className="alert alert-success my-3">
                  Room is available. Book now!
                </div>
              )}
              {available === false && (
                <div className="alert alert-danger my-3">
                  Room not available. Try different dates.
                </div>
              )}

              {available && !user && (
                <div className="alert alert-warning my-3">
                  Room is available. Login to book room.
                </div>
              )}

              {available && user && (
                <button
                  className="btn btn-block mt-4 py-3 booking-btn"
                  onClick={() => bookRoom(room._id, room.pricePerNight)}
                  disabled={bookingLoading || paymentLoading}
                >
                  {paymentLoading ? (
                    <ButtonLoader />
                  ) : (
                    `Pay - ${daysOfStay * room.pricePerNight}`
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <NewReview />
        <div className="reviews w-75">
          <h3>Reviews:</h3>
          <hr />
          {room.reviews && room.reviews.length > 0 ? (
            <ReviewsList reviews={room.reviews} />
          ) : (
            <p>
              <b>No Reviews on this room.</b>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default RoomDetails;
