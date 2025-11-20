// src/pages/About.jsx
import React from 'react';

export default function About() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold mb-6">About Us</h2>   

      <section className="mb-10">
        <p className="text-lg text-gray-700 mb-4">
          At <span className="font-semibold">Kharido Bhecho</span>, we believe in simplifying the process of buying and selling vehicles and electronics.
          Our journey started with the idea: what if people could list their cars, bikes, mobiles or laptops easily, and connect directly with buyers—without the usual hassle?
        </p>
        <p className="text-lg text-gray-700">
          Founded in 2025 in India, our platform brings together a trusted community of sellers and buyers,
          supported by smart filters, secure communication, and a seamless user experience.
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
        <p className="text-lg text-gray-700 mb-4">
          Our mission is to empower individuals to make informed buying and selling decisions – whether it’s a car, bike, mobile phone or a laptop.
        </p>
        <p className="text-lg text-gray-700">
          We aim to build a transparent marketplace where trust, ease and community matter.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-4">Our Values</h3>
        <ul className="list-disc pl-5 text-lg text-gray-700 space-y-2">
          <li>Integrity & Transparency</li>
          <li>User-First Experience</li>
          <li>Continuous Improvement</li>
          <li>Community Trust</li>
        </ul>
      </section>
    </div>
  );
}
