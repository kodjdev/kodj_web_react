import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RouterPage from "@/router/index";
import ErrorBoundary from "@/components/ErrorBoundary";
import RootLayout from "@/pages/layout";
import { RecoilRoot } from "recoil";
import { ModalProvider } from "./components/Modal/ModalProvider";

function App() {
  return (
    <>
      <ModalProvider>
        <RecoilRoot>
          <ErrorBoundary>
            <BrowserRouter>
              <RootLayout>
                <RouterPage />
              </RootLayout>
            </BrowserRouter>
          </ErrorBoundary>
        </RecoilRoot>
      </ModalProvider>
    </>
  );
}

export default App;
