"use client";
import ExpertsAndAchievements from "./doi-ngu-va-thanh-tuu";
import PartnersAndEquipment from "./doi-tac-chien-luoc";
import GennovaXSystem from "./he-thong-gennovax";
import VisionAndRoadmap from "./tam-nhin-va-su-menh";
const IntroductPage = () => {
  return (
    <div className="pt-20">
      <VisionAndRoadmap />
      <GennovaXSystem />
      <ExpertsAndAchievements />
      <PartnersAndEquipment />
    </div>
  );
};
export default IntroductPage;
