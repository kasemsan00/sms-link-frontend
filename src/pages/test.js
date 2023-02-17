import { useEffect, useState } from "react";
import { initConstraints } from "../components/VideoCall/function";

const constraints = initConstraints();

export default function Test() {
  const [error, setError] = useState("");
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        console.log(stream);
      })
      .catch((e) => {
        setError(e.constraint + " " + e.name + " " + e.message);
      });
  }, []);

  return (
    <div className={"w-screen h-screen bg-white"}>
      <div className={"w-full h-full text-2xl"}>{error}</div>
    </div>
  );
}
