import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PleaseLoginToView from "../../components/PleaseLoginToView";
import { reset, updateProfile } from "../../features/auth/authSlice";
import { checkCfUsername } from "../../utils/codeforcesHelper";
import {ReactComponent as ProfileAvatar} from '../../components/assets/profile-avatar.svg';

const ProfilePage = () => {
  const { user, profileUpdateSuccess, isLoading, isError, message } =
    useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const [formData, setFormData] = useState({
    name: user ? user.name : "",
    username: user ? user.username : "",
  });

  useEffect(() => {
    if (profileUpdateSuccess) {
      toast.success("Profile updated successfully");
    }
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [profileUpdateSuccess, isError, dispatch, message]);

  const onChange = (event) => {
    setFormData((previousState) => ({
      ...previousState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleUpdateProfile = (event) => {
    event.preventDefault();
    if (document.getElementById("profile-form").reportValidity()) {
      checkCfUsername(formData.username)
        .then(() => {
          const userData = {
            name: formData.name,
            username: formData.username,
          };
          dispatch(updateProfile(userData));
        })
        .catch(() => {
          toast.error(`CF username - ${formData.username} is invalid!`);
          dispatch(reset());
        });
    }
  };

  const handleUpdateProfilePhoto = (event) => {
    event.preventDefault();
    if (document.getElementById("profile-photo-form").reportValidity()) {
    }
  };

  const handleImageUpload = (e) => {
    console.log(e);
    if (e.target.files.length > 0) {
      if (
        e.target.files[0].size <= 1048576 &&
        (e.target.files[0].type === "image/jpeg" ||
          e.target.files[0].type === "image/png")
      ) {
        setSelectedImage(e.target.files[0]);
        setIsImageUploaded(true);
      } else {
        toast.error(
          "Only PNG and JPEG images with size less than 1MB are allowed"
        );
      }
    }
  };

  if (!user) {
    return <PleaseLoginToView />;
  }

  return (
    <div className="h-full w-full md:p-16">
      <div className="bg-gray-100 p-8 rounded-md">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Profile
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                This information will be displayed publicly so be careful what
                you share.
              </p>

              <div className="w-full mt-4 md:mt-8">
                <div className="flex flex-col">
                  <div className="mt-1 flex w-full justify-center items-center">
                    {/* Image */}
                    <span className="mx-4 inline-block rounded-full overflow-hidden border-gray-400 border-2">
                    {!user.imageUrl || user.imageUrl === "" ? (
                        <ProfileAvatar className='h-full w-full' />
                      ) : (
                        <img
                          src={user.imageUrl}
                          alt="avatar"
                          className="w-full h-full"
                        />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form id="profile-form">
              <div className="shadow rounded-md overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div className="grid grid-cols-4 gap-6">
                    <div className="col-span-4 sm:col-span-3">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        disabled={true}
                        required
                        autoComplete="email-address"
                        value={user.email}
                        className="mt-1 text-gray-500 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="name"
                        value={formData.name}
                        onChange={onChange}
                        className="mt-1 focus:ring-cyan-500 focus:border-cyan-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Codeforces Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={onChange}
                        autoComplete="given-name"
                        className="mt-1 focus:ring-cyan-500 focus:border-cyan-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    onClick={handleUpdateProfile}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Save
                  </button>
                </div>
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Change Profile Photo
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative text-center w-full cursor-pointer bg-white rounded-md font-medium text-cyan-600 hover:text-cyan-500"
                          >
                            <span>
                              {isImageUploaded
                                ? `${selectedImage.name}`
                                : "Upload a file"}
                            </span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleImageUpload}
                            />
                          </label>
                          {/* <p className="pl-1">
                            {isImageUploaded ? "" : "or drag and drop"}
                          </p> */}
                        </div>
                        <p className="text-xs text-gray-500">
                          {isImageUploaded ? "" : "PNG, JPG up to 1MB"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    onClick={handleUpdateProfilePhoto}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
