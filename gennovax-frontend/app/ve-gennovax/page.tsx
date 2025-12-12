"use client";

import { useEffect } from "react";

import ExpertsAndAchievements from "./doi-ngu-va-thanh-tuu";
import PartnersAndEquipment from "./doi-tac-chien-luoc";
import GennovaXSystem from "./he-thong-gennovax";
import VisionAndRoadmap from "./tam-nhin-va-su-menh";

const IntroductPage = () => {
  useEffect(() => {
    // Khi load trang có hash thì scroll tới đúng section
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        // Chờ các component con xuất hiện xong
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, []);

  return (
    <div>
      <VisionAndRoadmap />
      <GennovaXSystem />
      <ExpertsAndAchievements />
      <PartnersAndEquipment />
    </div>
  );
};

export default IntroductPage;
