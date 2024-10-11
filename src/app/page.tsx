"use client";
import React from "react";
import Link from "next/link";

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-100">
      <header className="bg-blue-600 text-white p-8 text-center">
        <h1 className="text-4xl font-bold">Prepare for Salesforce Certification</h1>
        <p className="mt-4 text-lg">Your ultimate study companion for mastering Salesforce.</p>
        <Link href="/registration">
          <button className="mt-6 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition">
            Get Started
          </button>
        </Link>
      </header>

      <main className="py-12">
        <section className="container mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Features</h2>
          {/* Added flex-wrap and space-x-4 to manage spacing */}
          <div className="flex flex-col md:flex-row justify-center md:space-x-4 items-center">
            <div className="bg-white shadow-lg p-6 rounded-lg max-w-sm mb-6 md:mb-0 transition transform hover:scale-105">
              <h3 className="text-xl font-semibold">AI-Powered Mock Exams</h3>
              <p>Practice with AI-generated questions tailored to your knowledge level.</p>
            </div>
            <div className="bg-white shadow-lg p-6 rounded-lg max-w-sm mb-6 md:mb-0 transition transform hover:scale-105">
              <h3 className="text-xl font-semibold">Progress Tracking</h3>
              <p>Monitor your progress and identify areas for improvement.</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Benefits</h2>
          <p className="mb-6">Unlock your potential and achieve your certification goals with our comprehensive study tool.</p>
          <ul className="list-disc list-inside mx-auto max-w-md">
            <li>Flexible learning at your own pace</li>
            <li>Access to a vast question bank</li>
          </ul>
        </section>

        {/* New section for Plans */}
        <section className="container mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore Our Plans?</h2>
          <Link href="/plans">
            <button className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
              View Plans
            </button>
          </Link>
        </section>
      </main>

      <footer className="bg-gray-200 py-6 text-center">
        <p className="text-sm">© 2024 Force Mock Exams. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
