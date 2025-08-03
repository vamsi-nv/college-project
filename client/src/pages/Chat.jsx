import { useEffect, useRef, useState } from "react";
import { fetchUserClubs } from "../utils/services";
import { LuSend } from "react-icons/lu";
import socket from "../utils/socket";
import { useAuth } from "../context/UserContextProvider";
import { PiArrowLeft, PiPlaceholder, PiUsersThree } from "react-icons/pi";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";

function useIsMobile(breakpoint = 768) {
  const getIsMobile = () =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false;

  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const onResize = () => setIsMobile(getIsMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}

function Chat() {
  const [clubs, setClubs] = useState([]);
  const [currentClub, setCurrentClub] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const { user } = useAuth();
  const [chatState, setChatState] = useState(false);
  const bottomRef = useRef(null);
  const isMobile = useIsMobile(768);
  const shouldShowChat = !isMobile || (isMobile && chatState);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentClub) return;

    const response = await axiosInstance.post(api_paths.messages.send_message, {
      clubId: currentClub._id,
      message: message,
    });

    const data = response.data;

    if (!data.success) return;

    socket.emit("sendMessage", {
      room: currentClub._id,
      message,
      sender: user.name,
    });

    setChat((prev) => [
      ...prev,
      { message, sender: user.name, createdAt: data.newMessage.createdAt },
    ]);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const clubs = await fetchUserClubs();
      if (clubs) setClubs(clubs);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!currentClub) return;

    socket.emit("joinRoom", currentClub._id);

    const handleMessage = ({ message, sender, createdAt }) => {
      setChat((prev) => [...prev, { message, sender, createdAt }]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
      socket.emit("leaveRoom", currentClub._id);
    };
  }, [currentClub]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentClub) return;

      try {
        const response = await axiosInstance.get(
          api_paths.messages.get_messages,
          {
            params: { clubId: currentClub._id },
          }
        );

        const data = response.data;

        if (data.success) {
          setChat(
            data.messages.map((m) => ({
              message: m.message,
              sender: m.sender.name,
              createdAt: m.createdAt,
            }))
          );
        }
      } catch (error) {
        toast.error("Failed to fetch messages");
      }
    };

    fetchMessages();
  }, [currentClub]);

  return (
    <div className="flex max-sm:mt-[51px] w-full h-screen">
      {/* Clubs Sidebar */}
      <div
        className={`flex-1 h-screen border-r border-gray-300 ${
          isMobile && shouldShowChat ? "hidden" : "block"
        }`}
      >
        <h2 className="px-4 py-6.5 text-xl font-medium border-b border-gray-300">
          Clubs
        </h2>

        <div>
          {clubs.map((club) => (
            <div
              key={club?._id}
              onClick={() => {
                setCurrentClub(club);
                setChatState(true);
              }}
              className={`cursor-pointer px-4 py-6 flex items-center gap-3 transition ${
                currentClub?._id === club?._id
                  ? "bg-primary/10 border-l-2 border-primary"
                  : "hover:bg-gray-200/50"
              }`}
            >
              {club.coverImage ? (
                <img
                  src={club.coverImage}
                  className="object-cover rounded-full w-14 h-14 "
                  alt={club.name}
                />
              ) : (
                <span className="p-2 text-white rounded bg-gradient-to-br from-primary/20 to-blue-600">
                  <PiPlaceholder className="w-6 h-6" />
                </span>
              )}
              <div>
                <p className="font-medium">{club.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {club.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      {shouldShowChat && (
        <div className="relative flex-[2] h-screen flex flex-col">
          {currentClub ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-2 p-4 border-b border-gray-300">
                {isMobile && (
                  <button
                    onClick={() => {
                      setChatState(false);
                      setCurrentClub(null);
                    }}
                    className="mr-2 font-medium "
                  >
                    <PiArrowLeft className="size-6" />
                  </button>
                )}

                {currentClub.coverImage ? (
                  <img
                    className="object-cover w-12 h-12 rounded-full"
                    src={currentClub.coverImage}
                    alt={currentClub.name}
                  />
                ) : (
                  <span className="text-white rounded-full bg-primary/100 ">
                    <PiUsersThree className="p-2 stroke-1 size-12" />
                  </span>
                )}
                <div className="flex flex-col items-start">
                  <p className="font-semibold text-gray-800">
                    {currentClub.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentClub.members.length} members
                  </p>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-primary/5">
                {chat.map((msg, i) => (
                  <div
                    key={i}
                    className={` mb-2 ${
                      msg.sender === user.name ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-6 p-2 rounded-lg shadow ${
                        msg.sender === user.name
                          ? "bg-primary rounded-br-none text-white"
                          : "bg-white rounded-tl-none"
                      }`}
                    >
                      <div>
                        {msg.sender !== user.name && (
                          <p className="text-xs font-semibold text-blue-600">
                            {msg.sender}
                          </p>
                        )}
                        <p className="mb-1 text-sm">{msg.message}</p>
                      </div>
                      <span
                        className={`self-end text-[10px] ${
                          msg.sender === user.name ? "text-gray-100" : ""
                        }`}
                      >
                        {moment(msg.createdAt).format("HH:mm")}
                      </span>
                    </div>
                  </div>
                ))}

                <div ref={bottomRef} />
              </div>

              <div className="flex items-center p-4 border-t border-gray-300">
                <input
                  onKeyDown={handleKeyPress}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  type="text"
                  className="flex-1 ring-1 ring-gray-300 focus:ring-1 focus:ring-primary px-4 py-2 border-none rounded-full outline-none "
                />
                {message && (
                  <button
                    onClick={handleSendMessage}
                    disabled={!message}
                    className="mx-4 font-medium text-white bg-gradient-to-br from-primary to-blue-600 p-2 rounded-full disabled:opacity-70"
                  >
                    <LuSend className="size-5" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a club to start chatting
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Chat;
