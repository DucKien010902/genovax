"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  medicalDocs,
  type MedicalDoc,
  type MedicalSection,
} from "@/data/medicalDocs";

type RouteParams = {
  slug: string;
};

export default function DetailPage() {
  const params = useParams<RouteParams>();

  const slug = params.slug;
  console.log(slug);

  const doc: MedicalDoc | undefined = medicalDocs.find((d) => d.id === slug);

  if (!doc) {
    return <div className="p-10">Document not found</div>;
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          href="/tai-lieu/tai-lieu-y-khoa"
          className="text-blue-600 hover:underline mb-6 inline-block"
        >
          &larr; Back to Library
        </Link>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-8 text-gray-900 border-b pb-4">
          {doc.title}
        </h1>

        {/* Sections */}
        <div className="space-y-8">
          {doc.sections.map((section: MedicalSection, idx: number) => (
            <section key={idx}>
              <h2 className="text-2xl font-semibold text-blue-800 mb-3">
                {section.heading}
              </h2>

              <div className="text-lg leading-relaxed whitespace-pre-line text-gray-700">
                {section.content}
              </div>

              {section.image && (
                <figure className="my-6 p-4 bg-gray-50 border rounded-lg">
                  <img
                    src={section.image}
                    alt={section.heading}
                    className="w-full h-80 object-cover rounded-md"
                  />
                  <figcaption className="text-sm text-gray-500 mt-2 italic">
                    Figure: {section.heading}
                  </figcaption>
                </figure>
              )}
            </section>
          ))}
        </div>

        {/* References */}
        {doc.references && doc.references.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold mb-4">References</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
              {doc.references.map((ref, idx) => (
                <li key={idx}>{ref}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
