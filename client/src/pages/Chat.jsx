import { useEffect, useRef, useState, useCallback, memo, useMemo } from "react";
import { LuSend } from "react-icons/lu";
import socket from "../utils/socket";
import { useAuth } from "../context/UserContextProvider";
import { PiArrowLeft } from "react-icons/pi";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";
import { nanoid } from "nanoid";
import { HiUsers } from "react-icons/hi2";
import { HiOutlineChatAlt } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const ClubProfileComponent = memo(({ club }) => {
  return (
    <div className="relative">
      {club.coverImage ? (
        <img
          src={club.coverImage}
          className="object-cover w-12 h-12 rounded-full"
          alt={club.name}
        />
      ) : (
        <span className="">
          <HiUsers className="w-12 h-12 p-2.5 text-gray-400 bg-contain bg-gray-200  rounded-full" />
        </span>
      )}
    </div>
  );
});

ClubProfileComponent.displayName = "ClubProfileComponent";

function useIsMobile(breakpoint = 768) {
  const getIsMobile = useCallback(
    () =>
      typeof window !== "undefined" ? window.innerWidth < breakpoint : false,
    [breakpoint]
  );

  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const onResize = () => setIsMobile(getIsMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [getIsMobile]);

  return isMobile;
}

const MessageItem = memo(
  ({
    msg,
    isCurrentUser,
    userName,
    onContextMenu,
    isHighlighted,
    messageIndex,
  }) => {
    const formattedTime = useMemo(
      () => moment(msg.createdAt).format("HH:mm"),
      [msg.createdAt]
    );

    const handleContextMenu = useCallback(
      (e) => {
        e.preventDefault();
        onContextMenu(e, messageIndex, msg);
      },
      [onContextMenu, messageIndex, msg]
    );

    return (
      <div
        className={`mb-2 relative p-2 rounded-lg ${
          isHighlighted ? "bg-blue-100" : ""
        } ${msg.sender === userName ? "text-right" : "text-left"}`}
        onContextMenu={handleContextMenu}
      >
        <div
          className={`inline-flex items-center gap-6 p-2 rounded-lg shadow cursor-context-menu transition-all duration-200 ${
            msg.sender === userName
              ? `bg-primary rounded-br-none text-white ${
                  isHighlighted ? "ring-2 ring-white ring-opacity-60" : ""
                }`
              : `bg-white rounded-tl-none ${
                  isHighlighted ? "ring-2 ring-primary/20 ring-opacity-60" : ""
                }`
          }`}
        >
          <div>
            {msg.sender !== userName && (
              <p className="text-xs font-semibold text-blue-600">
                {msg.sender}
              </p>
            )}
            <p className="mb-1 text-sm">{msg.message}</p>
          </div>
          <span
            className={`self-end text-[10px] ${
              msg.sender === userName ? "text-gray-100" : ""
            }`}
          >
            {formattedTime}
          </span>
        </div>
      </div>
    );

    // return (
    //   <div
    //     onClick={() => console.log(msg.dID)}
    //     onContextMenu={handleContextMenu}
    //     className={`mb-2 ${
    //       msg.sender === userName ? "text-right" : "text-left"
    //     }`}
    //   >
    //     <div
    //       className={`inline-flex items-center gap-6 p-2 rounded-lg shadow ${
    //         msg.sender === userName
    //           ? "bg-primary rounded-br-none text-white"
    //           : "bg-white rounded-tl-none"
    //       }`}
    //     >
    //       <div>
    //         {msg.sender !== userName && (
    //           <p className="text-xs font-semibold text-blue-600">
    //             {msg.sender}
    //           </p>
    //         )}
    //         <p className="mb-1 text-sm">{msg.message}</p>
    //       </div>
    //       <span
    //         className={`self-end text-[10px] ${
    //           msg.sender === userName ? "text-gray-100" : ""
    //         }`}
    //       >
    //         {formattedTime}
    //       </span>
    //     </div>
    //   </div>
    // );
  }
);

MessageItem.displayName = "MessageItem";

const ContextMenu = memo(({ position, onClose, onDelete, isDeleting }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const adjustedPosition = useMemo(() => {
    const menuWidth = 150;
    const menuHeight = 50;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let x = position.x;
    let y = position.y;
    if (x + menuWidth > windowWidth) {
      x = windowWidth - menuWidth - 10;
    }

    if (y + menuHeight > windowHeight) {
      y = windowHeight - menuHeight - 10;
    }

    return { x, y };
  }, [position]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 p-1 bg-white border border-gray-200 rounded-lg shadow-md min-w-[150px]"
      style={{
        top: `${adjustedPosition.y}px`,
        left: `${adjustedPosition.x}px`,
      }}
    >
      <button
        onClick={onDelete}
        disabled={isDeleting}
        className={`w-full p-2 text-sm text-left rounded-sm transition ${
          isDeleting
            ? "text-gray-400 cursor-not-allowed"
            : "text-red-600 hover:bg-red-50"
        }`}
      >
        {isDeleting ? "Deleting..." : "Delete for me"}
      </button>
    </div>
  );
});

ContextMenu.displayName = "ContextMenu";

const ClubItem = memo(({ club, currentClubId, unreadCount, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(club);
  }, [club, onSelect]);

  return (
    <div
      key={club?._id}
      onClick={handleClick}
      className={`cursor-pointer  px-4 py-6 flex items-center gap-3 transition relative ${
        currentClubId === club?._id
          ? "bg-gray-100 border-l-2 border-primary"
          : "hover:bg-gray-50"
      }`}
    >
      <ClubProfileComponent club={club} />

      <div className="flex-1">
        <p className="font-medium">{club.name}</p>
        <p className="text-sm text-gray-500 truncate w-xs">
          {club.description}
        </p>
      </div>
      {unreadCount > 0 && (
        <div className="flex flex-col items-center justify-center">
          <span className="text-xs text-primary">new</span>
          <div className="bg-primary text-white text-xs rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        </div>
      )}
    </div>
  );
});

ClubItem.displayName = "ClubItem";

function Chat() {
  const navigate = useNavigate();
  const [currentClub, setCurrentClub] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [chatState, setChatState] = useState(false);
  const bottomRef = useRef(null);
  const lastMessageCountRef = useRef(0);
  const isMobile = useIsMobile(768);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const shouldShowChat = !isMobile || (isMobile && chatState);

  const {
    user,
    userClubs,
    unreadMessageCounts,
    markClubMessagesAsRead,
    fetchUserClubsData,
  } = useAuth();

  const currentClubId = currentClub?._id;
  const userName = user?.name;

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !currentClub) return;

    const dID = nanoid();
    const messageToSend = message.trim();
    const tempMessage = {
      message: messageToSend,
      sender: user.name,
      dID,
      createdAt: new Date().toISOString(),
    };

    setChat((prev) => [...prev, tempMessage]);
    setMessage("");

    try {
      const response = await axiosInstance.post(
        api_paths.messages.send_message,
        {
          clubId: currentClub._id,
          message: messageToSend,
          dID,
        }
      );

      const data = response.data;

      if (data.success) {
        socket.emit("sendMessage", {
          room: currentClub._id,
          message: messageToSend,
          sender: user.name,
          dID,
          clubId: currentClub._id,
        });

        setChat((prev) =>
          prev.map((msg, index) =>
            index === prev.length - 1 && msg.message === messageToSend
              ? {
                  ...msg,
                  createdAt: data.newMessage.createdAt,
                  dID: data.newMessage.dID,
                }
              : msg
          )
        );
      } else {
        setChat((prev) => prev.slice(0, -1));
        setMessage(messageToSend);
      }
    } catch (error) {
      setChat((prev) => prev.slice(0, -1));
      setMessage(messageToSend);
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    }
  }, [message, currentClub, user?.name]);

  const handleDeleteMessage = useCallback(async () => {
    if (!selectedMessage || !currentClub || isDeleting) return;
    const messageIndex = selectedMessage.index;

    setIsDeleting(true);

    try {
      const response = await axiosInstance.patch(
        api_paths.messages.delete_message_for_me,
        { dID: selectedMessage.msg.dID }
      );

      const data = response.data;
      if (data.success) {
        setChat((prev) => prev.filter((_, index) => index !== messageIndex));
        toast.success("Message deleted");
      } else {
        toast.error("Failed to delete message");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
      console.error("Error deleting message:", error);
    } finally {
      setIsDeleting(false);
      setContextMenu(null);
      setSelectedMessage(null);
    }
  }, [selectedMessage, currentClub, isDeleting, user?._id]);

  const handleContextMenu = useCallback((e, index, msg) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
    });
    setSelectedMessage({ index, msg });
  }, []);

  const closeContextMenu = useCallback(() => {
    if (!isDeleting) {
      setContextMenu(null);
      setSelectedMessage(null);
    }
  }, [isDeleting]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleClubSelect = useCallback(
    async (club) => {
      setCurrentClub(club);
      setChatState(true);

      if (unreadMessageCounts[club._id] > 0) {
        await markClubMessagesAsRead(club._id);
      }
    },
    [unreadMessageCounts, markClubMessagesAsRead]
  );

  const handleBackClick = useCallback(() => {
    setChatState(false);
    setCurrentClub(null);
  }, []);

  const handleMessageChange = useCallback((e) => {
    setMessage(e.target.value);
  }, []);

  const clubsList = useMemo(
    () =>
      userClubs.map((club) => {
        const unreadCount = unreadMessageCounts[club._id] || 0;
        return (
          <ClubItem
            key={club._id}
            club={club}
            currentClubId={currentClubId}
            unreadCount={unreadCount}
            onSelect={handleClubSelect}
          />
        );
      }),
    [userClubs, unreadMessageCounts, currentClubId, handleClubSelect]
  );

  const messagesList = useMemo(
    () =>
      chat.map((msg, i) => (
        <MessageItem
          key={`${msg.createdAt}-${i}`}
          msg={msg}
          isCurrentUser={msg.sender === userName}
          userName={userName}
          onContextMenu={handleContextMenu}
          messageIndex={i}
          isHighlighted={selectedMessage?.index === i}
        />
      )),
    [chat, userName, handleContextMenu, selectedMessage]
  );

  useEffect(() => {
    fetchUserClubsData();
  }, [fetchUserClubsData]);

  useEffect(() => {
    if (!currentClub) return;

    socket.emit("joinRoom", currentClub._id);

    const handleMessage = ({ message, sender, createdAt, dID }) => {
      setChat((prev) => [...prev, { message, sender, createdAt, dID }]);
    };

    socket.on("message", handleMessage);

    return async () => {
      socket.off("message", handleMessage);
      socket.emit("leaveRoom", currentClub._id);
      await markClubMessagesAsRead(currentClub._id);
    };
  }, [currentClub]);

  useEffect(() => {
    if (chat.length > lastMessageCountRef.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      lastMessageCountRef.current = chat.length;
    }
  }, [chat.length]);

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
          const messages = data.messages.map((m) => ({
            message: m.message,
            sender: m.sender.name,
            createdAt: m.createdAt,
            dID: m.dID,
          }));
          setChat(messages);
          lastMessageCountRef.current = messages.length;
        }
      } catch (error) {
        toast.error("Failed to fetch messages");
      }
    };

    fetchMessages();
  }, [currentClub]);

  const showSendButton = message.trim().length > 0;

  return (
    <div className="flex max-sm:mt-[51px] w-full h-screen">
      <div
        className={`flex-1 h-screen border-r border-gray-300 ${
          isMobile && shouldShowChat ? "hidden" : "block"
        }`}
      >
        <h2 className="px-4 max-sm:py-4 py-6.5 text-base font-medium border-b border-gray-300">
          Chats
        </h2>

        {clubsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-10 text-gray-500">
            <HiUsers className="w-16 h-16 mb-4 text-gray-300" />
            <p className="mb-2 text-lg font-medium">No clubs found</p>
            <p className="text-sm text-gray-400 text-center">
              You are not a member of any clubs yet.
              <br />
              Join a club to start chatting!
            </p>
          </div>
        ) : (
          <div>{clubsList}</div>
        )}
      </div>

      {shouldShowChat && (
        <div className="relative flex-[2] h-screen flex flex-col">
          {currentClub ? (
            <>
              <div className="flex items-center gap-2 p-3.5 border-b border-gray-300">
                {isMobile && (
                  <button
                    onClick={handleBackClick}
                    className="mr-2 font-medium"
                  >
                    <PiArrowLeft className="size-6" />
                  </button>
                )}

                <ClubProfileComponent club={currentClub} />
                <div
                  onClick={() => navigate(`/clubs/${currentClub._id}`)}
                  className="cursor-pointer flex flex-col items-start"
                >
                  <p className="font-semibold text-gray-800">
                    {currentClub.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentClub.members.length} members
                  </p>
                </div>
              </div>

              <div className="relative flex-1 p-2 overflow-y-auto bg-primary/5">
                {messagesList}
                {contextMenu && (
                  <ContextMenu
                    position={contextMenu}
                    onClose={closeContextMenu}
                    onDelete={handleDeleteMessage}
                    isDeleting={isDeleting}
                  />
                )}

                <div ref={bottomRef} />
              </div>

              <div className="flex items-center p-4 border-t border-gray-300">
                <input
                  onKeyDown={handleKeyPress}
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="Type a message..."
                  type="text"
                  className="flex-1 px-4 py-2 border-none rounded-full outline-none ring-1 ring-gray-300 focus:ring-1 focus:ring-primary"
                />
                {showSendButton && (
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="p-2 mx-4 font-medium text-white rounded-full bg-gradient-to-br from-primary to-blue-600 disabled:opacity-70"
                  >
                    <LuSend className="size-5" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <HiOutlineChatAlt className="w-24 h-24 text-primary/90 fill-primary/20" />
              <p className="text-gray-600">
                {clubsList.length > 0
                  ? "Select a club to view conversation"
                  : "Join a club and start conversation"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Chat;
