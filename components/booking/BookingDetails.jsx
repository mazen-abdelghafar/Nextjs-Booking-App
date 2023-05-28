import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { MDBDataTable } from "mdbreact";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { clearErrors } from "../../redux/actions/bookingActions";

const BookingDetails = () => {
  const dispatch = useDispatch();

  const { booking, error } = useSelector((state) => state.bookingDetails);
  const { user: loadedUser } = useSelector((state) => state.loadUser);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors);
    }
  }, [dispatch]);

  const {
    _id: bookingId,
    room,
    user,
    checkInDate,
    checkOutDate,
    paymentInfo,
    amountPaid,
    daysOfStay,
  } = booking;

  const isPaid = paymentInfo.status === "paid";

  return (
    <div className="container">
      <div className="row d-flex justify-content-between">
        <div className="col-12 col-lg-8 mt-5 booking-details">
          {booking && room && user && (
            <>
              <h2 className="my-5">Booking # {bookingId}</h2>
              <h4 className="mb-4">User Info</h4>
              <p>
                <b>Name:</b> {user.name}
              </p>
              <p>
                <b>Email:</b> {user.email}
              </p>
              <p>
                <b>Amount:</b> ${amountPaid}
              </p>
              <hr />
              <h4 className="mb-4">Booking Info</h4>
              <p>
                <b>Check In:</b> {new Date(checkInDate).toLocaleString("en-US")}
              </p>
              <p>
                <b>Check Out:</b>{" "}
                {new Date(checkOutDate).toLocaleString("en-US")}
              </p>
              <p>
                <b>Days of Stay:</b> {daysOfStay}
              </p>
              <hr />

              <h4 className="my-4">Payment Info</h4>
              <p>
                <span>Status: </span>
                <span className={isPaid ? "greenColor" : "redColor"}>
                  {paymentInfo.status}
                </span>
              </p>

              {loadedUser && loadedUser.role === "admin" && (
                <p>
                  <span>Id: </span>
                  <span className={isPaid ? "greenColor" : "redColor"}>
                    {paymentInfo.id}
                  </span>
                </p>
              )}
              <h4 className="mt-5 mb-4">Booked Room:</h4>
              <hr />
              <div className="cart-item my-1">
                <div className="row my-5">
                  <div className="col-4 col-lg-2 text-center">
                    <Image
                      src={room.images[0].url}
                      alt={room.name}
                      height={45}
                      width={65}
                    />
                  </div>

                  <div className="col-5 col-lg-5">
                    <Link href={`/room/${room._id}`}>
                      <a>{room.name}</a>
                    </Link>
                  </div>

                  <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                    <p>${room.pricePerNight}</p>
                  </div>

                  <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                    <p>{daysOfStay} Day(s)</p>
                  </div>
                </div>
              </div>
              <hr />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
