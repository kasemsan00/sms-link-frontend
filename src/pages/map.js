import { useEffect, useRef } from "react";
import useTranslation from "next-translate/useTranslation";

let longDo;
let map;

export default function Map({ latitude, longitude }) {
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
        map.Event.bind("suggest", function (result) {
          if (result.data.length > 0) {
            setSuggestionData(result);
          }
        });
        map.location({ lon: longitude, lat: latitude });
      };
    }
  }, [lang]);
  return (
    <>
      <div className="w-full h-screen" ref={mapRef}></div>
    </>
  );
}
