import { useEffect, useRef } from "react";
import useTranslation from "next-translate/useTranslation";

let longDo;
let map;

export default function DisplayMap({ latitude, longitude }) {
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
}
