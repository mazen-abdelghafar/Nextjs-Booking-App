import React, { useEffect } from "react";
import Link from "next/link";

import { MDBDataTable } from "mdbreact";
import easyInvoice from "easyinvoice";
import Loader from "../layout/Loader";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  getAdminBookings,
  deleteBooking,
  clearErrors,
} from "../../redux/actions/bookingActions";
import { DELETE_BOOKING_RESET } from "../../redux/constants/bookingConstants";

const AllBookings = () => {
  const dispatch = useDispatch();

  const { bookings, error, loading } = useSelector((state) => state.bookings);
  const { isDeleted, error: deleteBookingError } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    dispatch(getAdminBookings());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteBookingError) {
      toast.error(deleteBookingError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Booking deleted successfully.");
      dispatch({ type: DELETE_BOOKING_RESET });
    }
  }, [dispatch, error, deleteBookingError, isDeleted]);

  const downloadInvoice = async (booking) => {
    const data = {
      // Customize enables you to provide your own templates
      // Please review the documentation for instructions and examples
      customize: {
        //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
      },
      images: {
        // The logo on top of your invoice
        logo: "https://res.cloudinary.com/kidkever/image/upload/v1645558729/bookit/bookit_logo_v4z7lo.png",
        // The invoice background
        // background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
      },
      // Your own data
      sender: {
        company: "Book IT",
        address: "13th Street. 47 W 13th St",
        zip: "10001",
        city: "New York",
        country: "United States",
      },
      // Your recipient
      client: {
        company: `${booking.user.name}`,
        address: `${booking.user.email}`,
        zip: `Check In: ${new Date(booking.checkInDate).toLocaleString(
          "en-US"
        )}`,
        city: "",
        country: `Check Out: ${new Date(booking.checkOutDate).toLocaleString(
          "en-US"
        )}`,
      },
      information: {
        // Invoice number
        number: `${booking._id}`,
        // Invoice data
        date: `${new Date(Date.now()).toLocaleString("en-US")}`,
        // Invoice due date
        "due-date": "Paid",
      },
      // The products you would like to see on your invoice
      // Total values are being calculated automatically
      products: [
        {
          quantity: `${booking.daysOfStay}`,
          description: `${booking.room.name}`,
          "tax-rate": 0,
          price: `${booking.room.pricePerNight}`,
        },
      ],
      // The message you would like to display on the bottom of your invoice
      "bottom-notice":
        "This is an auto generated Invoice of your bookingon Book IT.",
    };

    const result = await easyInvoice.createInvoice(data);
    easyInvoice.download(`invoice-${booking._id}.pdf`, result.pdf);
  };

  const handleBookingDelete = (id) => {
    dispatch(deleteBooking(id));
  };

  const setBookings = () => {
    const data = {
      columns: [
        {
          label: "Booking Id",
          field: "id",
          sort: "asc",
        },
        {
          label: "Check In",
          field: "checkIn",
          sort: "asc",
        },
        {
          label: "Check Out",
          field: "checkOut",
          sort: "asc",
        },
        {
          label: "Amount Paid",
          field: "amount",
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

    bookings &&
      bookings.forEach((booking) => {
        data.rows.push({
          id: booking._id,
          checkIn: new Date(booking.checkInDate).toLocaleString("en-US"),
          checkOut: new Date(booking.checkOutDate).toLocaleString("en-US"),
          amount: `$${booking.amountPaid}`,
          actions: (
            <>
              <Link href={`/bookings/${booking._id}`}>
                <a className="btn btn-primary">
                  <i className="fa fa-eye"></i>
                </a>
              </Link>
              <button
                className="btn btn-success mx-2"
                onClick={() => downloadInvoice(booking)}
              >
                <i className="fa fa-download"></i>
              </button>
              <button
                className="btn btn-danger mx-2"
                onClick={() => handleBookingDelete(booking._id)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </>
          ),
        });
      });

    return data;
  };

  return (
    <div className="container container-fluid">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="my-5">{`${bookings && bookings.length} Bookings`}</h1>
          <MDBDataTable
            data={setBookings()}
            className="px-3"
            bordered
            striped
            hover
          />
        </>
      )}
    </div>
  );
};

export default AllBookings;
