import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";

export default function SelectCamera({ selectCameraRef, handleSelectCamera }) {
  return (
    <div className="modal bg-transparent shadow-sm drop-shadow-md" ref={selectCameraRef}>
      <div className="modal-box relative p-[0px]">
        <ul className="menu bg-base-100 rounded-box">
          <li onClick={() => handleSelectCamera("front")}>
            <a className="py-5 flex flex-1 justify-center items-center">
              <VideoCameraFrontIcon fontSize="large" />
              กล้องหน้า
            </a>
          </li>
          <li onClick={() => handleSelectCamera("back")}>
            <a className="py-5 flex flex-1 justify-center items-center">
              <VideoCameraBackIcon fontSize="large" />
              กล้องหลัง
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
