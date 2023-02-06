import "../assets/niems-style.css";
import "../assets/custom.css";
import "../assets/loading.css";
import "../assets/videocall.css";
import "../assets/chat.css";
import { QueryClientProvider, QueryClient } from "react-query";
import { Provider } from "react-redux";
import store from "../redux/store";

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <Component {...pageProps} />
            </QueryClientProvider>
        </Provider>
    );
}
