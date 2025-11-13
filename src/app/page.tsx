"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, PiggyBank, LineChart, FolderClock } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const features = [
    {
      title: "Make Payment",
      description: "Contribute easily using online/offline payment options.",
      icon: PiggyBank,
    },
    {
      title: "Payment History",
      description: "Track all your contributions in one place.",
      icon: FolderClock,
    },
    {
      title: "Analytics & Insights",
      description:
        "Visualize total contributions, top contributors, and trends.",
      icon: LineChart,
    },
    {
      title: "Top Contributors",
      description: "See who is leading in contributions for the farewell.",
      icon: Trophy,
    },
  ];

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-12 space-y-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-800">
          KV School Class 12 Contributions
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join your classmates in making the farewell event memorable. Track
          contributions, participate in fundraising, and celebrate together!
        </p>
        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          <Button size="lg" className="px-8">
            Contribute Now
          </Button>
          <Button size="lg" variant="outline" className="px-8">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <Card
            key={idx}
            className="shadow-lg rounded-3xl hover:shadow-2xl transition-all duration-300 border border-gray-200"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800">
                <feature.icon className="h-6 w-6 text-indigo-500" />
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Stats Section */}
      <section className="space-y-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Our Impact</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Over 100+ students have contributed so far. Together, we can make the
          farewell unforgettable.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          <Card className="shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200">
            <h3 className="text-4xl font-bold text-indigo-500">120+</h3>
            <p className="text-gray-600 mt-2">Contributors</p>
          </Card>
          <Card className="shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200">
            <h3 className="text-4xl font-bold text-indigo-500">$24,300</h3>
            <p className="text-gray-600 mt-2">Total Contributions</p>
          </Card>
          <Card className="shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200">
            <h3 className="text-4xl font-bold text-indigo-500">12</h3>
            <p className="text-gray-600 mt-2">Days to Farewell</p>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center mt-12 space-y-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-800">
            Ready to Contribute?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Make your contribution today and help make our farewell celebration
            memorable!
          </p>
          <div className="flex justify-center gap-4 flex-wrap mt-4">
            <Button size="lg" className="px-8">
              Contribute Now
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Explore Features
            </Button>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
