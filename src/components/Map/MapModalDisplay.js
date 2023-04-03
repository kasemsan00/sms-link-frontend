import { useEffect, useRef } from "react";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";
import useTranslation from "next-translate/useTranslation";
let map, longDo;

const MapModalSelect = ({ latitude, longitude }) => {
  const { lang } = useTranslation();
  const mapRef = useRef(null);

  useEffect(() => {
    const existingScript = document.getElementById("longdoMapScript");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://api.longdo.com/map/?key=` + process.env.NEXT_PUBLIC_LONGDOO_KEY;
      script.id = "longdoMapScript";
      document.body.appendChild(script);

      script.onload = () => {
        longDo = window.longdo;
        map = new window.longdo.Map({
          placeholder: mapRef.current,
          language: lang,
        });
        map.zoom(16, false);
        map.location(longDo.LocationMode.Geolocation);
      };
    }
  }, [lang]);

  useEffect(() => {
    if (map !== undefined) {
      map.location({ lon: longitude.toString(), lat: latitude.toString() });
    }
  }, [latitude, longitude]);
  return (
    <>
      <div className="h-full" ref={mapRef}></div>
    </>
  );
};

export default function MapModalDisplay({ displayMap, setDisplayMap }) {
  const modalRef = useRef(null);
  useIsomorphicLayoutEffect(() => {
    if (displayMap.latitude !== 0 && displayMap.longitude !== 0) {
      modalRef.current.classList.add("modal-open");
    }
  }, [displayMap]);
  const handleCloseModal = () => {
    setDisplayMap({
      latitude: 0,
      longitude: 0,
    });
    modalRef.current.classList.remove("modal-open");
  };
  return (
    <div className="modal z-50 " ref={modalRef}>
      <div className="modal-box relative p-0">
        <label className="btn btn-sm btn-circle absolute right-2 top-2 z-50" onClick={handleCloseModal}>
          ✕
        </label>
        <div className="h-[500px]">
          <MapModalSelect latitude={displayMap.latitude} longitude={displayMap.longitude} />
        </div>
      </div>
    </div>
  );
}
