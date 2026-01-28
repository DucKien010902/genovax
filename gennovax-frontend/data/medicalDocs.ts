// data.js
export interface MedicalSection {
  heading: string;
  content: string;
  image?: string;
}

export interface MedicalDoc {
  id: string;
  title: string;
  summary: string;
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
  {
    id: "edwards-syndrome-trisomy-18",
    summary:
      "Edwards syndrome (trisomy 18) is a chromosomal disorder caused by an extra chromosome 18, leading to multiple severe congenital anomalies and high mortality. Recent advances in medical care have improved survival, requiring individualized, multidisciplinary management and supportive family-centered care.",
    title: "Edwards Syndrome (Trisomy 18)",
    sections: [
      {
        heading: "Introduction",
        content: `Edwards syndrome was first reported by Edwards et al in 1960 in a neonate with multiple congenital malformations and cognitive deficits. Trisomy 18 is an autosomal chromosomal aneuploidy caused by an extra chromosome 18, leading to various congenital malformations, and is the second most common autosomal trisomy after trisomy 21. Traditionally, infants diagnosed with trisomy 18 are offered comfort care as the condition is deemed lethal. Recent literature suggests a shift in the management of the condition. Technological interventions are now being offered, with more parents choosing these interventions. Comprehensive care requires a multidisciplinary approach and empathetic support for families to navigate complex medical and ethical decisions. This activity reviews the clinical presentation, evaluation, and management of Edwards syndrome, highlighting key information useful for the interprofessional team in identifying, assessing, and approaching patients with this condition and their families.`,
      },
      {
        heading: "Epidemiology",
        content: `The live birth prevalence of Edwards syndrome ranges from 1 in 3600 to 1 in 10,000. In the past 2 decades, the prevalence of trisomy 18 has increased due to an increase in the average maternal age. The prevalence of Edwards syndrome varies by country and termination policies. In the United States, the overall prevalence of Edwards syndrome is approximately 1 in 2500, and the liveborn prevalence is 1 in 8600. The prevalence is higher in females compared to males, with a ratio of 3:2. However, fetal loss is higher in males compared to females, and females have better survival rates compared to males.`,
      },
      {
        heading: "Prognosis",
        content: `Although trisomy 18 remains life-limiting, recent advances in medical care have significantly improved survival rates and outcomes. Approximately 50% of fetuses carried to term are born alive, although 40% die during labor, and one-third of surviving fetuses are delivered preterm. Among live-born infants with trisomy 18, 60% to 75% survive the first week, 20% to 40% survive the first month, and 10% to 19% survive the first year. More recent studies indicate that intensive medical interventions, such as advanced hospital care and cardiac surgeries, can increase 1-year survival rates to 30% to 50%.

Female infants with trisomy 18 have a higher likelihood of survival compared to males, and individuals with mosaic trisomy 18 often experience more prolonged survival compared to those with complete trisomy 18. The primary causes of mortality include cardiac failure due to congenital heart defects and respiratory complications, such as obstructive apnea, pulmonary hypertension, and central apnea. Advancements, driven by increased hospitalizations, surgeries, and technological interventions, such as cardiac surgery, underscore the importance of revising outdated terminology. Although trisomy 18 remains life-limiting, it is vital to adopt language that accurately reflects the progress in care and honors the experiences of affected individuals and families.`,
      },
      {
        heading: "Etiology",
        content: `Edwards syndrome typically results from an extra copy of chromosome 18q. There are 3 types of Edwards syndrome—complete trisomy 18, partial trisomy 18, and mosaic trisomy 18.

Complete trisomy 18 is the most common form (94%). In this type, every cell contains 3 complete copies of chromosome 18. The extra chromosome is due to nondisjunction, mostly during meiosis II. The extra chromosome is most often of maternal origin. The frequency of nondisjunction errors increases with advancing maternal age.

Mosaic trisomy 18 is the second most common type (<5%). In this type, both a complete trisomy 18 and a normal cell line exist. Thus, the phenotype can range from a complete trisomy 18 phenotype with early mortality to a normal phenotype.

Partial trisomy 18 accounts for 2% of Edwards syndrome. In this type, only a partial segment of chromosome 18q is present in triplicate. The partial triplicate often results from a balanced translocation or inversion carried by 1 of the parents. The phenotype of partial trisomy 18 is variable based on the location and extent of the triplicated segment.

The prevalence of Edwards syndrome is positively correlated with advancing maternal age. The recurrence risk for complete trisomy 18 is 0.5% to 1% for subsequent pregnancies. If 1 parent is found to be a carrier of a balanced translocation leading to an unbalanced translocation in the child, as observed in partial trisomy 18, the recurrence risk can be higher, up to 20%, for subsequent pregnancies.`,
      },
      {
        heading: "Pathophysiology",
        content: `The phenotype of Edwards syndrome appears to be associated with 3 copies of 2 critical regions on the long arm of chromosome 18, specifically from 18q12.1 to 18q21.2 and 18q22.3 to 18qter. Severe mental retardation in Edwards syndrome may be associated with trisomy of 18q12.1 to 18q21.2. The trisomy of the short arm of chromosome 18 (18p) does not seem to cause any of the major features of Edwards syndrome.`,
      },
      {
        heading: "Disease Manifestation",
        content: `Edwards syndrome is characterized by variable clinical manifestations. More than 125 anomalies have been reported as features of Edwards syndrome. However, none of the clinical features are pathognomonic for Edwards syndrome.

Most cases of Edwards syndrome are diagnosed prenatally, often through antenatal screening with maternal age, maternal serum markers, or ultrasound findings during the second trimester. Antenatally, Edwards syndrome can reveal intrauterine growth restriction, polyhydramnios, agenesis of the corpus callosum, choroid plexus cyst, nuchal thickening, brachycephaly, clenched hands with overriding index fingers, cardiac defects, omphalocele, and a single umbilical artery. Edwards syndrome has a high risk of fetal loss and stillbirth.

Postnatally, Edwards syndrome is characterized by a cluster of phenotypes, including the following:

Neurologic findings
Neonatal hypotonia followed by hypertonia
Apnea
Seizures
Poor sucking
Delayed psychomotor development and mental retardation

Craniofacial findings
Skull: Microcephaly, bitemporal narrowing, and prominent occiput
Face: Triangular and asymmetrical face with facial paralysis
Eyes: Microphthalmia, hypertelorism, epicanthus, short palpebral fissures, coloboma of the iris, cataract, corneal clouding, hypoplastic supraorbital ridge, upward or downward slanting palpebral fissures, and abnormal retinal pigmentation.
Nose: Prominent nasal bridge with hypoplastic nasal root, upturned nares, and choanal atresia
Oral cavity: Micro-retrognathia, microstomia, narrow arched palate, cleft lip, and cleft palate
Ears: Microtia, preauricular appendages, low-set or retroverted ears, and dysplastic ears

Skeletal
Severe growth retardation
Short neck
Short sternum
Broad chest, with or without widely spaced small nipples
Incomplete ossification of the clavicle
Hemivertebrae or fused vertebrae and scoliosis
Pectus excavatum
Narrow pelvis and limitation of the hip abduction
Hip dislocation
Arthrogryposis
Clenched hands with overriding fingers, camptodactyly, syndactyly, single palmar crease and clinodactyly of the fifth fingers, radial or thumb hypoplasia, and hypoplastic nails
Rocker-bottom feet with prominent calcanei, talipes equinovarus, and dorsiflexed great toes

Cardiovascular
Cardiac defects in 90% of patients with Edwards syndrome
Ventricular or atrial septal defect, patent ductus arteriosus, tetralogy of Fallot, overriding aorta, coarctation of the aorta, and hypoplastic left heart syndrome
Polyvalvular heart disease (involving 2 or more valves, most commonly the aortic and pulmonary valves)

Pulmonary
Pulmonary hypoplasia
Tracheobronchomalacia, laryngomalacia
Obstructive and central apnea
Early-onset pulmonary hypertension

Gastrointestinal
Omphalocele
Esophageal atresia with tracheoesophageal fistula
Pyloric stenosis
Ileal atresia
Malrotation
Meckel diverticulum
Diastasis recti
Umbilical hernia

Genitourinary
Cryptorchidism, hypospadias, and micropenis
Clitoral hypertrophy, hypoplasia of the labia majora, ovarian dysgenesis, and bifid uterus
Horseshoe kidney, renal agenesis, and hydronephrosis

Central nervous system malformations (occur in 30% of cases)
Cerebellar hypoplasia
Meningoencephalocele
Anencephaly
Hydrocephalus
Holoprosencephaly
Arnold-Chiari malformation
Hypoplasia of the corpus callosum`,
      },
      {
        heading: "Diagnosis / Screening",
        content: `The evaluation and diagnosis of trisomy 18 begin in the antenatal period. Maternal serum screening can show low levels of alpha-fetoprotein, human chorionic gonadotropin, and unconjugated estriol. Serum and genetic markers are more useful when combined with classic ultrasound findings, such as increased nuchal translucency. For example, noninvasive prenatal testing using cell-free fetal DNA in maternal plasma has a role in diagnosing trisomy 18 but has a positive predictive value of only 60.7% when used alone. Combined with ultrasound, noninvasive prenatal testing has a positive predictive value of 100% and a negative predictive value of up to 100% by the second trimester. Amniocentesis or chorionic villus sampling is recommended if the antenatal screening suggests a high risk for fetal aneuploidy.

Postnatally, phenotypic variation and clinical presentation guide the evaluation. Diagnostic imaging studies, such as ultrasonography, can assess intracranial, cardiac (echocardiogram), intra-abdominal, and renal abnormalities; however, circumstances dictate the study of choice. Screening is essential in these patients, as anomalies often involve multiple organ systems. Although the diagnosis is typically clinical, karyotyping can confirm trisomy, and microarray testing provides more detailed information about mosaicism.`,
      },
      {
        heading: "Health Surveillance Guidelines",
        content: `The child with Edwards syndrome should be assessed for growth during each visit, and results should be plotted on specific growth charts.
Sucking or swallowing difficulties can be assessed using a radiographic swallow study, which can be helpful when considering the ability of the child to protect the airway.
Cognitive and motor development should be assessed at each visit, and referral to early intervention, if needed, is recommended.
An ophthalmologist referral is necessary at birth to rule out eye malformations and again in childhood to check for refractive errors and photophobia. An audiologist referral is essential at birth to rule out sensorineural hearing loss.
A thorough neurologic examination should be performed at each visit to detect signs of hypertonia or seizures, and a referral to a neurologist is recommended.
An echocardiogram at birth should be performed to evaluate for congenital heart disease and pulmonary hypertension.
Abdominal ultrasound is recommended at birth to screen for renal malformations and should be repeated every 6 months until adolescence to monitor for neoplasms, such as Wilms tumor or hepatoblastoma.
An orthopedic examination should be performed at every visit to check for joint contractures or scoliosis.
A pulmonologist referral and a sleep study are recommended if obstructive or central apnea is encountered.
Referrals to a gastroenterologist and nutritionist are warranted if enteral nutrition or management of gastroesophageal reflux is needed`,
      },
      {
        heading: "Treatment / Management",
        content: `There is no definitive treatment for Edwards syndrome. Ethical issues exist around the treatment plan for newborns with Edwards syndrome due to the high mortality rate and difficulty predicting which infants survive beyond their first year of life. The major causes of sudden death in Edwards syndrome are neurological instability, cardiac failure, and respiratory failure. An individualized approach should be considered for each patient, giving the utmost importance to the parental choices in the child's best interests.

Delivery room and neonatal intensive care unit management: Previously, trisomy 18 was considered lethal, and resuscitation at birth was not indicated. The American Academy of Pediatrics and the recent Neonatal Resuscitation Program guidelines no longer advocate withholding active management, including resuscitative efforts in the delivery room.
Feeding management: Nasogastric tube feeding and gastrostomy feeding are considered to address feeding issues. Gastroesophageal reflux can be initially managed with medical therapy and later with surgical options if refractory.
Cardiac management: Diuretics and digoxin are used for heart failure. Palliative and corrective cardiac surgery is recommended for complex congenital heart defects.
Infections: The standard approach to treating respiratory infections, pneumonia, urinary tract infections, and otitis media is recommended.
Orthopedic management may be required, particularly for scoliosis due to hemivertebra.
Psychiatric management: The family should receive psychosocial support, including information on support organizations.`,
      },
      {
        heading: "Complications",
        content: `Edwards syndrome is associated with a wide range of severe complications that affect multiple organ systems. These complications contribute to the high morbidity and mortality rates observed in affected individuals, often requiring multidisciplinary management to address the complex medical challenges. Major complications are as follows:

Growth: Low birth weight followed by failure to thrive is common in Edwards syndrome. Patients with Edwards syndrome have feeding difficulties, gastroesophageal reflux, and recurrent aspiration. Edwards syndrome–specific growth curves are available for tracking development.
Developmental delay: Severe to profound developmental delays are common. Cognitive and motor delays are noted in most surviving patients with Edwards syndrome. A few cases of Edwards syndrome, mosaic type, have been reported with normal intelligence.
Cardiorespiratory failure: This is the leading cause of death in Edwards syndrome, often due to congenital cardiac defects, hypoventilation, central apnea, and pulmonary hypoplasia.
Neoplasm: Edwards syndrome increases the risk of neoplasms such as Wilms tumor/nephroblastoma, hepatoblastoma, and Hodgkin disease.
Endocrine: Thymic hypoplasia and adrenal hypoplasia are common in patients with Edwards syndrome.`,
      },
      {
        heading: "Differential Diagnosis",
        content: `The differential diagnosis of Edwards syndrome is relatively broad and includes the following conditions:

Fetal akinesia sequence (Pena-Shokeir syndrome type I): An autosomal recessive condition characterized by facial anomalies, including micrognathia; multiple joint contractures; intrauterine growth restriction; polyhydramnios; and pulmonary hypoplasia.
Patau syndrome (trisomy 13)
Distal arthrogryposis type I with joint contractures
CHARGE syndrome (coloboma, heart malformations, atresia of the nasal choanae, retardation of growth, genital abnormalities, and ear abnormalities)
VACTERL association (vertebral defects, anal atresia, cardiovascular defects, tracheoesophageal fistula, esophageal atresia, renal anomalies, and limb defects)`,
      },
    ],
    references: ["StatPearls - NCBI Bookshelf: Edwards Syndrome (Trisomy 18)"],
  },
  {
    id: "down-syndrome-trisomy-21",
    title: "Down Syndrome (Trisomy 21)",
    summary:
      "Down syndrome (trisomy 21) is a genetic disorder caused by the presence of all or a portion of a third chromosome 21. Patients typically present with mild to moderate intellectual disability, growth retardation, and characteristic facial features.",
    sections: [
      {
        heading: "Introduction",
        content:
          "Down syndrome was first described by an English physician, John Langdon Down, in 1866, but its association with chromosome 21 was established almost 100 years later in the laboratory of Raymond Turpin in Paris. Drs. Marth Gutier and Jerome Lejeune were Turpin's students. Credit for the association is debated. It is the presence of all or part of the third copy of chromosome 21 that causes Down syndrome, the most common chromosomal abnormality occurring in humans. It is also found that the most frequently occurring live-born aneuploidy is trisomy 21, which causes this syndrome.\n\nDown syndrome (trisomy 21) is a genetic disorder caused by the presence of all or a portion of a third chromosome 21. Patients typically present with mild to moderate intellectual disability, growth retardation, and characteristic facial features. This activity reviews the evaluation and management of Down syndrome and explains the role of the interprofessional team in improving care for patients with this condition.",
      },
      {
        heading: "Epidemiology",
        content:
          "The incidence of Down syndrome increases with maternal age, and its occurrence varies in different populations (1 in 319 to 1 in 1000 live births). It is also known that the frequency of Down syndrome fetuses is quite high at the time of conception, but about 50% to 75% of these fetuses are lost before term. The occurrence of other autosomal trisomy is much more common than the 21, but the postnatal survival is very poor as compared to Down syndrome. This high percentage of survival of patients with trisomy 21 is thought to be a function of a small number of genes on chromosome 21 called Hsa21, which is the smallest and least dense of the autosomes.",
      },
      {
        heading: "Prognosis",
        content:
          "With the recent advances in the medical practice, development of surgical techniques for the correction of congenital disabilities, and improvement in general care, there has been a tremendous increase in the survival of infants and life expectancy of patients with Down syndrome. A Birmingham (United Kingdom) study done almost 60 years ago showed that 45% of infants survived the first year of life, and only 40% would be alive at 5 years. A later study conducted about 50 years after that showed that 78% of patients with Down syndrome plus a congenital heart defect survived for 1 year, while the number went up to 96% in patients without the anomalies. This rise in the life expectancy of these patients should continue to rise significantly because of the developments in medical science. Healthcare facilities aim to provide proper and timely management to these patients and to help them to have a fulfilled and productive life.",
      },
      {
        heading: "Etiology",
        content:
          "The majority of patients with Down syndrome have an extra copy of chromosome 21. There are different hypotheses related to the genetic basis of Down syndrome and the association of different genotypes with the phenotypes. Among them is gene dosage imbalance, in which there is an increased dosage or number of genes of Hsa21, which results in increased gene expansion. It further includes the possibility of association of different genes with different phenotypes of Down syndrome. The other popular hypothesis is the amplified development instability hypothesis, according to which the genetic imbalance created by a number of trisomic genes results in a greater impact on the expression and regulation of many genes.\n\nThe critical region hypothesis is also well-known in this list. Down syndrome critical regions (DSCR) are a few chromosomal regions that are associated with partial trisomy for Has21. DSCR on 21q21.22 is responsible for many clinical features of Down syndrome. After a thorough study of different analyses, it became clear that a single critical region gene cannot cause all the phenotypical features associated with trisomy 21, rather it is more evident that multiple critical regions or critical genes have a role to play in this phenomenon.",
      },
      {
        heading: "Evaluation",
        content:
          "There are different methods used for the prenatal diagnosis of Down syndrome. Ultrasound, between 14 and 24 weeks of gestation, can be used as a tool for diagnosis based on soft markers like increased nuchal fold thickness, small or no nasal bone, and large ventricles. Nuchal translucency (NT) is detected by ultrasound and is caused by a collection of fluid under the skin behind the fetal neck. It is done between 11 and 14 weeks of gestation. Other causes of this finding include trisomy 13 (Patau syndrome), trisomy 18 (Edwards syndrome), and Turner syndrome. Amniocentesis and chorionic villus sampling have widely been used for the diagnosis, but there is a small risk of miscarriages between 0.5% to 1%.\n\nSeveral other methods have also been developed and are used for the rapid detection of trisomy 21 both during fetal life and after birth. The FISH of interphase nuclei is most commonly used by either using Hsa21-specific probes or the whole of the Hsa21. Another method that is currently being used is QF-PCR, in which the presence of 3 different alleles is determined by using DNA polymorphic markers. The success of this method depends upon the informative markers and the presence of DNA. It has been found that up to 86.67% of cases of Down syndrome can be identified by using the STR marker method.\n\nA relatively new method called paralogue sequence quantification (PSQ) uses the paralogue sequence on the Hsa21 copy number. It is a PCR-based method that uses the paralogue genes to detect the targeted chromosome number abnormalities, which is known as paralogue sequence quantification.\n\nThere are non-invasive prenatal diagnostic methods that are being studied to be used for the diagnosis of Down syndrome prenatally. These are based on the presence of fetal cells in the maternal blood and the presence of cell-free fetal DNA in the maternal serum.\n\nCell-free fetal DNA makes up 5% to 10% of the maternal plasma, and it increases during pregnancy and clears after delivery. Though this method has been used to determine fetal Rh status in Rhive women, sex in sex-linked disorders, and for the detection of paternally inherited autosomal recessive and dominant traits, its use for the detection of chromosomal aneuploidy, especially the trisomy is still a challenge.\n\nFew other recent methods like digital PCR and next-generation sequencing (NGS) are also being developed for the diagnosis of Down syndrome.",
      },
      {
        heading: "Clinical Features",
        content: `Different clinical conditions are associated with Down syndrome as different systems are affected by it. These patients have a wide array of signs and symptoms like intellectual and developmental disabilities or neurological features, congenital heart defects, gastrointestinal (GI) abnormalities, characteristic facial features, and abnormalities.
Congenital Cardiac Defects (CHD)
Congenital cardiac defects are by far the most common and leading cause associated with morbidity and mortality in patients with Down syndrome, especially in the first 2 years of life. Though different suggestions have been made about the geographical as well as seasonal variation in the occurrence of different types of congenital cardiac defects in trisomy 21, so far none of the results have been conclusive.
The incidence of CHD in babies born with Down syndrome is up to 50%. The most common cardiac defect associated with Down syndrome is an atrioventricular septal defect (AVSD), and this defect makes up to 40% of the congenital cardiac defects in Down syndrome. It is said to be associated with the mutation of the non-Hsa21 CRELD1 gene. The second most common cardiac defect in Down syndrome is a ventricular septal defect (VSD), which is seen in about 32% of the patients with Down syndrome. Together with AVSD, these account for more than 50% of congenital cardiac defects in patients with Down syndrome.
The other cardiac defects associated with trisomy 21 are secundum atrial defect (10%), tetralogy of Fallot (6%), and isolated PDA (4%), while about 30% of the patients have more than one cardiac defect. There is geographical variation in the prevalence of the cardiac defect in Down syndrome, with VSD being the most common in Asia and secundum type ASD in Latin America. The reason behind this difference in the prevalence of different types of CHD in different regions is still unclear, and many factors such as regional proximity have been found to contribute.
Because of such a high prevalence of CHD in patients with Down syndrome, it has been recommended that all patients get an echocardiogram within the first few weeks of life.
Gastrointestinal (GI) Tract Abnormalities
Patients with trisomy 21 have many structural and functional disorders related to the GI tract. Structural defects can occur anywhere from the mouth to anus, and it has been found that certain defects like duodenal and small bowel atresia or stenosis, annular pancreas, imperforate anus, and Hirschsprung disease occur more commonly in these patients as compared to the general population.
About 2% of patients with Down syndrome have Hirschsprung disease while 12% of patients with Hirschsprung disease have Down syndrome. Hirschsprung disease is a form of functional lower intestinal obstruction in which the neural cells fail to migrate to the distal segment of the rectum resulting in an aganglionic segment which does not have normal peristalsis resulting in failure of normal defecation reflex causing a functional obstruction. The infant usually presents with signs and symptoms related to intestinal obstruction. Duodenal atresia and imperforate anus usually present in the neonatal period.
Apart from the structural defects patients with Down syndrome, patients are also prone to many other GI disorders like gastroesophageal reflux (GERD), chronic constipation, intermittent diarrhea, and celiac disease. Since there is a strong association of celiac disease with Down syndrome being present in about 5% of these patients, it is recommended to do yearly screening of celiac disease. Once diagnosed, these patients will have to remain on a gluten-free diet for the rest of life.
Hematologic Disorders
There are several hematological disorders associated with Down syndrome. The hematological abnormalities in a newborn with Down syndrome (HANDS) constitute neutrophilia, thrombocytopenia, and polycythemia, which are seen in 80%, 66% and 34% of Down syndrome babies respectively. HANDS is usually mild and resolves within the first thr3e weeks of life.
The other disorder that is quite specific to Down syndrome is a transient myeloproliferative disorder, which is defined as detection of blast cells in younger than 3 month old babies with Down syndrome. It is characterized by the clonal proliferation of megakaryocytes and is detected during the first week of life and is resolved by 3 months of life. It is also known as transient abnormal myelopoiesis or transient leukemia and is known to be present in about 10% of patients with Down syndrome. If this occurs in the fetus, it can cause spontaneous abortion.
Patients with Down syndrome are 10-times more at risk of developing leukemia, which constitute about 2% of all pediatric acute lymphoblastic leukemia and 10% of all pediatric acute myeloid leukemia. Thirty percent of Down syndrome patients with acute lymphoblastic leukemia have an association with function mutation in Janus Kinase 2 gene.
About 10% of patients with chronic myeloid leukemia (TML) develop leukemogenesis of acute megakaryoblastic leukemia (AMKL) before the age of 4 years. AMKL is associated with GATA1 gene which is an X-linked transcriptor factor leading to an uncontrolled proliferation of immature megakaryocytes.
Neurologic Disorders
Trisomy of Hsa21 has associated with reduced brain volume especially hippocampus and cerebellum. Hypotonia is the hallmark of babies with Down syndrome and is present in almost all of them. It is defined as decreased resistance to passive muscle stretch and is responsible for delayed motor development in these patients. Because of hypotonia Down syndrome patients have joint laxity that causes decreased gait stability and increased energy requirement for physical exertion. These patients are prone to decreased bone mass and increased risk of fractures due to the low level of physical activity, while the ligamentous laxity predisposes these patients to atlantoaxial subluxation.
Five percent to 13% of children with Down syndrome have seizures, out of that, 40% will have seizures before their first birthday, and in these cases, the seizures are usually infantile spasms. Down syndrome children with infantile spasm do respond better to antiepileptics as compared to other kids with the same, and therefore, early intervention and treatment improve the developmental outcome.
Lennox-Gestaut syndrome is also seen to be more prevalent in children with Down syndrome when it does occur, has a late onset, and is associated with reflex seizures along with an increased rate of EEG abnormalities.
Forty percent of patients with Down syndrome develop tonic-clonic or myoclonic seizures in their first 3 decades. Dementia occurs more commonly in patients older than 45 years of age with Down syndrome, and about 84% are more prone to develop seizures. The seizures in these patients are related to the rapid decline in their cognitive functions.
The risk of developing early-onset Alzheimer disease is significantly high in patients with Down syndrome with 50% to 70% of patients developing dementia by the age of 60 years. Amyloid precursor protein (APP), which is known to be associated with increased risk for the Alzheimer disease is found to be encoded on Hsa21, and trisomy of this protein is likely to be responsible for increased frequency of dementia in people with Down syndrome. Recent studies have shown that triplication of APP is associated with increased risk of early-onset Alzheimer disease even in the normal population.
Nearly all the patients with Down syndrome have mild to moderate learning disability. Trisomy of multiple genes including DYRK1A, synaptojanin 1, and single-minded homolog 2 (SIM2) have been found to cause learning and memory defects in mice, which suggests the possibility that the overexpression of these genes may likely be causing the learning disability in people with Down syndrome.
Endocrinological Disorders
Thyroid gland dysfunction is most commonly associated with Down syndrome. Hypothyroidism can be congenital or acquired at any time during life. The newborn screening program in New York has reported an increased incidence of congenital hypothyroidism in babies with Down syndrome as compared to the others. The anti-thyroid autoantibodies were found in 13% to 34% of patients with Down syndrome who had acquired hypothyroidism, and the concentration of these antibodies increased after 8 years of life. About half of the patients with Down syndrome have been shown to have subclinical hypothyroidism with elevated TSH and normal thyroxine levels. Hyperthyroidism is much less frequent in patients with Down syndrome as compared to hypothyroidism, although the rate of it still exceeds the incidence of hyperthyroidism in the general pediatric population.
Abnormalities in sexual development are also noted to be significant with delayed puberty in both genders. In girls, primary hypogonadism presents as delay in menarche or adrenarche, while in boys it can manifest as cryptorchidism, ambiguous genitalia, micropenis, small testes, low sperm count, and scanty growth of axillary and pubic hair.
 The insulin-like growth factor is also said to be responsible for the delay in skeletal maturation and short stature in patients with Down syndrome.
Musculoskeletal Disorders
Children with Down syndrome are at an increased risk of reduced muscle mass because of hypotonia increased ligamentous laxity which causes retardation of gross motor skills and can result in joint dislocation. These patients also have vitamin D deficiency due to several factors like inadequate exposure to sunlight, inadequate intake of vitamin D, malabsorption secondary to celiac disease, increased breakdown because of anticonvulsant therapy, among other factors. These factors increase the risk of decreased bone mass in children with Down syndrome and predispose them to recurrent fractures.
Refractive Errors and Visual Abnormalities
Ocular and orbital anomalies are common in children with Down syndrome. These include blepharitis (2-7%), keratoconus (5-8%), cataract (25% to 85%), retinal anomalies (0% to 38%), strabismus (23% to 44%), amblyopia (10% to 26%), nystagmus (5% to 30%), refractive errors (18% to 58%), glaucoma (less than 1%), iris anomalies (38% to 90%) and optic nerve anomalies (very few cases).
The ocular anomalies, if left untreated, can significantly affect the lives of these patients. Therefore, all the patients with Down syndrome should have an eye exam is done during the first 6 months of life and then annually.
Otorhinolaryngological ( ENT) Disorders
Ear, nose, and throat problems are also quite common in patients with Down syndrome. The anatomical structure of the ear in Down syndrome patients predisposes them to hearing deficits. Hearing loss is usually conductive because of impaction of cerumen and middle ear pathologies, including chronic middle ear effusion due to the small Eustachian tube, acute otitis media, and eardrum perforation. These patients usually require pressure equalization tubes for the treatment.
The sensorineural hearing loss has also been associated with Down syndrome because of the structural abnormalities in the inner ears such as narrow internal auditory canals.
`,
      },
      {
        heading: "Treatment / Management",
        content:
          "The management of patients with Down syndrome is multidisciplinary. Newborns with suspicion of Down syndrome should have a karyotyping done to confirm the diagnosis. The family needs to be referred to the clinical geneticist for the genetic testing and counseling of both parents.\n\nParental education is one of the foremost aspects regarding the management of Down syndrome, as parents need to be aware of the different possible conditions associated with it so that they can be diagnosed and treated appropriately. Treatment is basically symptomatic, and complete recovery is not possible.\n\nThese patients should have their hearing and vision assessed, and as they are more prone to have cataracts, timely surgery is required. Thyroid function tests should be done on a yearly basis and, if deranged, should be managed accordingly.\n\nA balanced diet, regular exercise, and physical therapy are needed for optimum growth and weight gain, although feeding problems improve after cardiac surgery.\n\nCardiac referral should arranged for all the patients regardless of the clinical signs of congenital heart disease. If present, this should be corrected within the first 6 months of life to ensure optimum growth and development of the child.\n\nOther specialties involved include a developmental pediatrician, pediatric pulmonologist, gastroenterologist, neurologist, neurosurgeon, orthopedic specialist, child psychiatrist, physical and occupational therapist, speech and language therapist, and audiologist.",
      },
      {
        heading: "Differential Diagnosis",
        content:
          "Congenital hypothyroidism\nMosaic trisomy 21 syndrome\nPartial trisomy 21 (or 21q duplication)\nRobertsonian trisomy 21\nTrisomy 18\nZellweger syndrome or other peroxisomal disorders",
      },
      {
        heading: "Enhancing Healthcare Team Outcomes",
        content:
          "The management of patients with Down syndrome is an interprofessional endeavor. Newborns with suspicion of Down syndrome should have a karyotyping done to confirm the diagnosis. The family needs to be referred to the clinical geneticist for the genetic testing and counseling of both parents.\n\nBecause almost every organ system is involved, the child needs to be seen by the ophthalmologist, orthopedic surgeon, cardiologist, dermatologist, gastroenterologist, physical therapist, mental health nurse, ENT surgeon, and behavior specialist.\n\nParental education is one of the foremost aspects regarding the management of Down syndrome, as parents need to be aware of the different possible conditions associated with it so that they can be diagnosed and treated appropriately. Treatment is basically symptomatic, and complete recovery is not possible.\n\nWhile life span has increased over the past 3 decades, these individuals still have a shorter life expectancy compared to healthy individuals.",
      },
    ],
    references: ["https://www.ncbi.nlm.nih.gov/books/NBK526016/"],
  },
];
