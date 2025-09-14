import { useRef, useState } from "react";
import { LuUpload, LuTrash } from "react-icons/lu";

function ProfilePhotoSelector({
  image,
  setImage,
  Icon,
  profileImageUrl,
  setProfileImageUrl,
  removeImage,
}) {
  const inputRef = useRef();
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="size-22 flex items-center justify-center bg-blue-100/50 rounded-full relative">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              className="size-20 rounded-full object-cover"
              alt="Profile Photo"
            />
          ) : (
            <Icon className=" text-4xl text-primary/90 size-full p-4" />
          )}
          {profileImageUrl ? (
            <button
              onClick={() => {
                setProfileImageUrl("");
                removeImage(true);
              }}
              className="size-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
            >
              <LuTrash />
            </button>
          ) : (
            <button
              type="button"
              onClick={onChooseFile}
              className="size-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1"
            >
              <LuUpload />
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Profile photo"
            className="size-20 rounded-full object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="size-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePhotoSelector;
