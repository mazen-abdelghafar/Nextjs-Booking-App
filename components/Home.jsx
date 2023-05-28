import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { toast } from "react-toastify";
import Pagination from "react-js-pagination";

import RoomItem from "./room/RoomItem";
import { clearErrors } from "../redux/actions/roomActions";
import Link from "next/link";

const Home = () => {
  const { rooms, roomsCount, resPerPage, filteredRoomsCount, error } =
    useSelector((state) => state.allRooms);

  const dispatch = useDispatch();
  const router = useRouter();

  let { page = 1, location, guestCapacity, category } = router.query;
  page = +page;

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, []);

  const handlePagination = (pageNumber) => {
    router.push(`/?page=${pageNumber}`);
  };

  let count = roomsCount;
  if (location || guestCapacity || category) {
    count = filteredRoomsCount;
  }

  return (
    <>
      <section id="rooms" className="container mt-5">
        <h2 className="mb-3 ml-2 stays-heading">
          {location ? `Rooms in ${location}` : "All Rooms"}
        </h2>
        <Link href="/search">
          <a className="ml-2 back-to-search">
            <i className="fa fa-arrow-left"></i> Back to Search
          </a>
        </Link>
        <div className="row">
          {rooms && rooms.length === 0 ? (
            <div className="alert alert-danger mx-auto mt-5 w-25 text-center">
              <b>No Rooms.</b>
            </div>
          ) : (
            rooms &&
            rooms.map((room) => <RoomItem key={room._id} room={room} />)
          )}
        </div>
      </section>
      {count > resPerPage && (
        <div className="mt-2 d-flex justify-content-center">
          <Pagination
            activePage={page}
            itemsCountPerPage={resPerPage}
            totalItemsCount={count}
            onChange={handlePagination}
            nextPageText={"Next"}
            prevPageText={"Prev"}
            firstPageText={"First"}
            lastPageText={"Last"}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      )}
    </>
  );
};

export default Home;
