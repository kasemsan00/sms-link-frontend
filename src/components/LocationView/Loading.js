import { SyncLoader } from "react-spinners";

const Loading = () => {
    return <SyncLoader loading={true} speedMultiplier={0.7} color={"red"} size={40} aria-label="Loading Spinner" data-testid="loader" />;
};

export default Loading;
