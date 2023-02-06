import { useState, useEffect, useLayoutEffect, useRef } from "react";

export default function StopWatch({ start }) {
    const timeCounterRef = useRef(null);

    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(true);

    useEffect(() => {
        if (start) {
            setTime(0);
        }
        setRunning(start);
    }, [start]);

    useEffect(() => {
        let interval = 0;
        if (running) {
            interval = window.setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (!running) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running]);

    useLayoutEffect(() => {
        if (timeCounterRef !== null) {
            const h = ("0" + Math.floor((time / 3600) % 60)).slice(-2);
            const m = ("0" + Math.floor((time / 60) % 60)).slice(-2);
            const s = ("0" + (time % 60)).slice(-2);
            timeCounterRef.current.innerHTML = h + ":" + m + ":" + s;
        }
    }, [time, timeCounterRef]);

    return <div className="font-semibold text-white" ref={timeCounterRef}></div>;
}
