import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Banner from "./Banner";
import AwarenessSection from "./components/AwarenessSection";
import WhyLearnSection from "./components/WhyLearnSection";
import TopicPage from "./pages/TopicPage";
import TopicsListPage from "./pages/TopicsListPage";
import Dashboard from "./pages/Dashboard";
import Footer from "./Footer";
import CyberBot from "./components/CyberBot";
import RevisionFlashcardsSection from "./components/RevisionFlashcardsSection";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Home page */}
        <Route
          path="/"
          element={
            <>
              <Banner />
              <AwarenessSection />
              <WhyLearnSection />
              <RevisionFlashcardsSection />
            </>
          }
        />

        {/* Dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* All topics listing */}
        <Route path="/topics" element={<TopicsListPage />} />

        {/* Individual topic */}
        <Route path="/topic/:topicId" element={<TopicPage />} />
      </Routes>
      <Footer />
      <CyberBot />
    </Router>
  );
}

export default App;
