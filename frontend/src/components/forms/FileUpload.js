import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Badge } from "antd";
import { hideLoading, showLoading } from "react-redux-loading";

const FileUpload = ({ values, setValues }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fileUploadAndResize = (e) => {
    console.log(e.target.files);
    // resize
    const { files } = e.target;
    const allUploadedFiles = values.images;

    if (files) {
      for (let file of files) {
        Resizer.imageFileResizer(
          file,
          720,
          720,
          "JPEG",
          100,
          0,
          async (uri) => {
            const headers = {
              headers: {
                authtoken: user ? user.token : "",
              },
            };
            console.log("FileUpload headers=", headers);

            try {
              dispatch(showLoading());
              const res = await axios.post(
                `${process.env.REACT_APP_API}/uploadimages`,
                { image: uri },
                {
                  headers: {
                    authtoken: user ? user.token : "",
                  },
                }
              );
              console.log("uploadimages res=", res);
              allUploadedFiles.push(res.data);
              setValues((prev) => ({ ...prev, images: allUploadedFiles }));
            } catch (error) {
              console.log(error);
            } finally {
              dispatch(hideLoading());
            }
          },
          "base64"
        );
      }
    }

    // send to server to upload to cloudinary
    // set URL to images[] in parent component.
  };

  const handleImageRemove = async (public_id) => {
    console.log("remove image", public_id);
    dispatch(showLoading());

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/removeimage`,
        { public_id },
        {
          headers: {
            authtoken: user ? user.token : "",
          },
        }
      );
      const { images } = values;
      const filteredImages = images.filter((i) => i.public_id !== public_id);
      setValues((prev) => ({ ...prev, images: filteredImages }));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <>
      <div className="row">
        {values.images &&
          values.images.map((image) => (
            <Badge
              key={image.public_id}
              count="X"
              onClick={() => handleImageRemove(image.public_id)}
              style={{ cursor: "pointer" }}
            >
              <Avatar
                src={image.url}
                size={100}
                shape="square"
                className="ml-3"
              />
            </Badge>
          ))}
      </div>
      <div className="row">
        <label className="btn btn-primary">
          Upload files
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
};

export default FileUpload;
