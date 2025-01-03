import React from "react";

export const MyPage = React.lazy(() => import("../pages/MyPage/MyPage.tsx"));
export const EventDetails = React.lazy(() => import("../pages/Events/details/EventDetails.tsx"));
export const EventRegister = React.lazy(() => import("../pages/EventRegister/EventRegister.tsx"));
export const NewsDetails = React.lazy(() => import("../pages/News/NewsDetails/NewsDetails.tsx"));
export const NewsList = React.lazy(() => import("../pages/News/NewsList.tsx"));