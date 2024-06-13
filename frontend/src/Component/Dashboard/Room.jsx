import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import RoomTable from "./RommTable";
import { IoMenu, IoCloseOutline } from "react-icons/io5";
import useAuthRedirect from "../../../context/useAuth";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";


const Room = () => {
  useAuthRedirect();

  const [roomData, setRoomData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [message, setMessage] = useState("");
  const [isSidebarToggle, setIsSidebarToggle] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "https://hostel-management-app.vercel.app/room/get-all-room"
        );
        setRoomData(response.data);
        
      } catch (error) {
        setIsLoading(false);
        if (error.response && error.response.status === 400) {
          setMessage("Cannot fetch room...");
        } else {
          setMessage("server error!");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const filteredRooms = roomData.filter((res) => {
      const roomLocation = res.roomLocation?.toLowerCase() || "";
      const roomStatus = res.roomStatus?.toLowerCase() || "";

      return (
        roomLocation.includes(search.toLowerCase()) ||
        roomStatus.includes(search.toLowerCase())
      );
    });
    setSearchResult(filteredRooms);
  }, [roomData, search]);

  const handleAddRoom = (newRoomData) => {
    setRoomData((prevData) => [...prevData, newRoomData]);
  };

  const handleUpdateRoom = (updatedRoomData) => {
    setRoomData((prevData) =>
      prevData.map((room) =>
        room._id === updatedRoomData._id ? updatedRoomData : room
      )
    );
  };

  const removeRoom = async (id) => {
    try {
      await axios.delete(`https://hostel-management-app.vercel.app/room/delete-room/${id}`);
      setRoomData((prevRoomData) =>
        prevRoomData.filter((room) => room._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete room", error);
    }
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete This Room",
      message: "Are You Sure You Want To Delete This Room?",
      buttons: [
        {
          label: "Delete",
          onClick: () => removeRoom(id),
        },
        {
          label: "Cancel",
          onClick: () => alert("Deletion cancelled"),
        },
      ],
    });
  };

  return (
    <>
      <div>
        {isSidebarToggle && (
          <div className="mobile-side-nav">
            <Sidebar />
          </div>
        )}

        <div className="--flex-justify-between">
          <div className="desktop-side-nav">
            <Sidebar />
          </div>

          <div className="--flex-dir-column --overflow-y-auto --flex-One --overflow-x-hidden">
            <main className="--flex-justify-center w-full">
              <div className="right dash-main">
                <div className="--flex-justify-between">
                  <h1>Hostel Room Listing</h1>

                  {isSidebarToggle ? (
                    <IoCloseOutline
                      className="sidebar-toggle-iconB"
                      onClick={() => setIsSidebarToggle(false)}
                    />
                  ) : (
                    <IoMenu
                      className="sidebar-toggle-iconB"
                      onClick={() => setIsSidebarToggle(true)}
                    />
                  )}
                </div>
                <input
                  placeholder="Search by room number, status, or location"
                  type="text"
                  className="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <RoomTable
                  rooms={searchResult}
                  onAddRoom={handleAddRoom}
                  onUpdateRoom={handleUpdateRoom}
                  onDeleteRoom={confirmDelete}
                />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Room;
