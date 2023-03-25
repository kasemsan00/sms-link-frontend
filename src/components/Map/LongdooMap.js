import { useEffect, useRef, useState } from "react";
import useTranslation from "next-translate/useTranslation";

let longDo;
let map;

export default function LongdooMap({ setLocation }) {
  const mapRef = useRef(null);
  const handleMapRef = useRef(null);
  const searchResultRef = useRef(null);
  const searchInputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [suggestionData, setSuggestionData] = useState();
  const { lang } = useTranslation();
  const { t } = useTranslation("common");

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
        map.Search.placeholder(searchResultRef.current);
        map.Event.bind("suggest", function (result) {
          if (result.data.length > 0) {
            setSuggestionData(result);
          }
        });
        map.Event.bind("location", function () {
          const location = map.location();
          setLocation(location);
        });
        mapRef.current.classList.remove("hidden");
        handleMapRef.current.classList.remove("hidden");
      };
    }
  }, [lang, setLocation]);

  const handleDoSearch = ({ keyword, area, tag, span, limit }) => {
    map.Search.search(keyword, { area, tag, span, limit: 5 });
    setSuggestionData();
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    if (event.target.value === "") {
      setSuggestionData();
    }
  };

  useEffect(() => {
    if (searchValue !== "") {
      map.Search.suggest(searchValue);
    }
  }, [searchValue]);

  return (
    <>
      <div className="w-full h-[calc(100%-48px)] hidden" ref={mapRef} />
      <div className="form-control w-full h-[48px] hidden z-50 overflow-hidden" ref={handleMapRef}>
        <div className="input-group">
          <input
            type="text"
            style={{ outline: "none", borderRadius: "0px" }}
            placeholder={t("search-map-input")}
            className="input input-bordered w-full"
            onChange={handleSearchChange}
            ref={searchInputRef}
            value={searchValue}
          />
        </div>
        <div className="overflow-x-auto fixed bottom-[47px] z-50 overflow-hidden" style={{ borderRadius: "0px" }}>
          <table className="table table-compact border overflow-hidden" style={{ outline: "none", borderRadius: "0px" }}>
            <tbody>
              {suggestionData !== undefined
                ? suggestionData.data.map((item, index) => {
                    return (
                      <tr key={index} className="cursor-pointer" onClick={() => handleDoSearch({ keyword: item.w })}>
                        <td>{item.w}</td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto fixed bottom-[47px]" ref={searchResultRef}></div>
      </div>
    </>
  );
}
