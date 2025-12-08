// data.js
export interface MedicalSection {
  heading: string;
  content: string;
  image?: string;
}

export interface MedicalDoc {
  id: string;
  title: string;
  sections: MedicalSection[];
  references?: string[];
}
export const medicalDocs = [
  {
    id: "patau-syndrome", // Slug dùng cho URL
    title: "Patau Syndrome (Trisomy 13)",
    summary:
      "Patau syndrome, also called trisomy 13, is a clinical syndrome that occurs when all or some cells of the body contain an extra copy of chromosome 13.",
    sections: [
      {
        heading: "Introduction",
        content: `Trisomy 13 was first described as the cause of a distinct clinical syndrome in 1960 by Dr. Patau et al. The clinical syndrome was initially characterized as "cerebral defects, apparent anophthalmia, cleft palate, hare lip, simian creases, trigger thumbs, polydactyly, and capillary hemangiomata."
        Patau syndrome, also called trisomy 13, is a clinical syndrome that occurs when all or some cells of the body contain an extra copy of chromosome 13.
        Patau syndrome is diagnosed either prenatally or at birth. Advanced maternal age is a risk for trisomy 13 due to an increased frequency of nondisjunction. However, 20% of Patau syndrome can result from an unbalanced translocation and rarely by mosaicism. Multiple large studies have detailed the poor prognosis of patients with Patau syndrome. Median survival is 7 to 10 days in live-born patients, and 90% live for less than 1 year. Recently, there have been reports of several cases of longer survival due to aggressive medical therapy. Long surviving patients with Patau syndrome are less likely to have cerebral and cardiovascular malformations, typically the primary cause of the poor prognosis with Patau syndrome. Even in these cases of increased survival, severe disability remains the expectation of these patients.`,
      },
      {
        heading: "Prognosis",
        content: `Multiple large studies have detailed the overall poor prognosis of patients with Patau syndrome. Historically, median survival is 7 to 10 days in live-born patients, and 90% do not survive to 1 year. Recently, reported cases of longer duration survival have come to light with the use of aggressive medical interventions. Prognosis is better in patients with mosaic Patau syndrome and patients with unbalanced translocations. Aggressive management with surgical and medical intervention may extend median survival to 733 days according to a recent study.`,
      },
      {
        heading: "Etiology",
        content: `The cause of Patau syndrome is the presence of three copies of chromosome 13; this is due most commonly to nondisjunction in meiosis, occurring more frequently in mothers of advanced age (age greater than 35). Another cause is an unbalanced Robertsonian translocation, which results in two normal copies of chromosome 13 and an additional long arm of chromosome 13. Another less common cause is mosaicism, which results in 3 copies of chromosome 13 in some cells and two copies in the others. Mosaicism is the outcome of a mitotic nondisjunction error and is unrelated to maternal age. Prognosis is better in patients with mosaicism and patients with unbalanced translocations.`,
        image:
          "https://res.cloudinary.com/da6f4dmql/image/upload/v1764321779/gen-n-z7271772333640_a441b3b00ff681b0e0968532030c248e_fmhyp5.jpg",
      },
      {
        heading: "Epidemiology",
        content: `Cytogenetic abnormalities are present in 50% of fetal deaths before 20 weeks gestational age and are present in 6% to 13% of stillbirths. Overall, fetal death occurs in 15% of pregnancies that are recognized clinically. Trisomy 13 is one of the more common trisomies and occurs in 1 per 5000 total births. This frequency is less common than Down syndrome, which occurs in 1 per 700 total births. The incidence of Edwards syndrome is similar, occurring in about 1 per 5000 live births.`,
      },
      {
        heading: "History and Physical",
        content: `Infants with Patau syndrome typically have intrauterine growth restriction and microcephaly. Facial defects are primarily midline and include cyclopia, cleft lip, and cleft palate. Facial features include a sloping forehead, small malformed ears, anophthalmia or microphthalmia, micrognathia, and pre-auricular tags. Central nervous system abnormalities are also usually midline, with alobar holoprosencephaly being the most common defect. Common extremity defects include postaxial polydactyly, congenital talipes equinovarus, or rocker-bottom feet.

        The spectrum of cardiac disease in Patau syndrome includes a ventricular septal defect, atrial septal defect, tetralogy of Fallot, atrioventricular septal defect, and double outlet right ventricle. Interestingly, the cardiac defects alone typically are non-lethal in infancy or childhood, even if left untreated.

        Additional organ systems affected by abnormalities include the lungs, liver, kidneys, genitourinary tract, digestive tract, and pancreas. Defects in these organ systems that occur in greater than 50% of patients with Patau syndrome include cryptorchidism, hypospadias, labia minora hypoplasia, and bicornuate uterus. Abnormalities in these organ systems occurring in less than 50% of patients with Patau syndrome include omphalocele, incomplete rotation of the colon, Meckel diverticulum, polycystic kidney, hydronephrosis, and horseshoe kidney.

        Patients surviving past infancy have a severe psychomotor disorder, failure to thrive, intellectual disability, and seizures.`,
      },
      {
        heading: "Evaluation",
        content: `Diagnosis of Patau syndrome can be made prenatally with chorionic villi sampling, amniocentesis, or fetal free DNA analysis. These methods of testing detect trisomy 13. Prenatal ultrasound can also help detect the malformations of Patau syndrome, such as holoprosencephaly or other central nervous system anomalies, facial anomalies, skeletal abnormalities, renal or cardiac defects, and growth restriction that are typically present. Prenatal ultrasound after 17 weeks gestation is most sensitive in detecting the abnormalities of Patau syndrome. Abnormal findings should have confirmation performed with a cytogenetic evaluation of fetal cells. Tissue microarray has increased the ability to diagnose genetic alterations in fetal death, especially when the fetus is macerated.`,
      },
      {
        heading: "Differential Diagnosis",
        content: `The sonographic findings of a fetus with Patau syndrome may have overlap with Edwards syndrome (trisomy 18), Down syndrome (trisomy 21), or other chromosomal abnormalities. Cytogenetic evaluation with chorionic villi sampling, amniocentesis, fetal free DNA analysis, or tissue microarray would distinguish trisomy 13 from these other cytogenetic abnormalities.`,
      },
      {
        heading: "Treatment / Management",
        content: `Intensive treatment of Patau syndrome is controversial due to the universally poor prognosis of patients despite treatment.
        At delivery, infants diagnosed with Patau syndrome may need post-delivery oxygenation and ventilation; this may require intubation or tracheostomy due to facial defects. Patients with cardiac defects may require cardiac surgery to repair common cardiac abnormalities. Other surgeries may be indicated for common defects including herniorrhaphy, cleft lip repair, feeding tube placement, or corrective orthopedic surgeries.
        Additional treatments may be performed including specialized dietary feeds, seizure prophylaxis, prophylactic antibiotics for urinary tract infections, and the use of hearing aids.`,
      },
      {
        heading: "Complications",
        content: `Ninety percent of patients with Patau syndrome do not survive until one year after birth, and many die in utero. There may be many other complications related to common congenital anomalies if a patient survives past infancy.`,
      },
      {
        heading: "Deterrence and Patient Education",
        content: `Trisomies and other cytogenetic abnormalities are more common in pregnancies of females of advanced maternal age. Patients considering getting pregnant at this age should be counseled on this increased risk. If a fetus or newborn is diagnosed with Patau syndrome, the family should be counseled on the poor prognosis of the disorder.`,
      },
      {
        heading: "Enhancing Healthcare Team Outcomes",
        content: `Patau syndrome requires an interprofessional team approach. Parents of patients diagnosed with this devastating disease should be provided with education and support regarding all of the possible complications the infant may be born with. For the delivery, the team would include maternal-fetal medicine specialists, neonatologists, neonatal intensive care nurses, and respiratory therapists. If aggressive medical therapy is to be pursued, otolaryngologists, cardiologists, neurologists, urologists, and orthopedic surgeons would need to collaborate for the best possible outcomes. Physical and occupational therapists may be needed as well as speech therapists and audiologists. As the psychological toll on the families of patients with Patau syndrome is extensive, mental health specialists should be utilized as soon as the diagnosis is made.`,
      },
    ],
    references: [
      "Wyllie JP, Wright MJ, Burn J, Hunter S. Natural history of trisomy 13. Arch Dis Child. 1994 Oct;71(4):343-5.",
      "PATAU K, SMITH DW, THERMAN E, INHORN SL, WAGNER HP. Multiple congenital anomaly caused by an extra autosome. Lancet. 1960 Apr 09;1(7128):790-3.",
      "Patau Syndrome, Grant M. Williams; Robert Brady. 2023 June 26",
    ],
  },
];
