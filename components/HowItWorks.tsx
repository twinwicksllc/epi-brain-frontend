import { UserPlus, Sparkles, Rocket } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up in seconds with your email. No credit card required to get started with our free tier."
  },
  {
    icon: Sparkles,
    title: "Choose Your AI Personality",
    description: "Select from 9 specialized AI personalities tailored to your specific needs - business, learning, fitness, mental health, and more."
  },
  {
    icon: Rocket,
    title: "Start Your Journey",
    description: "Begin conversations instantly. Your AI companion remembers context across chats and adapts to your goals."
  }
];

export default function HowItWorks() {
  return (
    <section className="container mx-auto px-6 py-20" aria-labelledby="how-it-works-heading">
      <h2 id="how-it-works-heading" className="text-4xl font-bold text-white text-center mb-16">
        How It Works
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="relative">
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#7B3FF2] to-[#A78BFA] rounded-full flex items-center justify-center text-white font-bold text-xl">
                {index + 1}
              </div>
              
              {/* Step Content */}
              <div className="bg-[#2d1b4e] border border-[#7B3FF2]/20 rounded-xl p-8 pt-12 hover:border-[#7B3FF2] transition-all hover:shadow-lg hover:shadow-[#7B3FF2]/20">
                <div className="w-16 h-16 bg-[#7B3FF2]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="text-[#7B3FF2]" size={32} />
                </div>
                
                <h3 className="text-2xl font-semibold text-white mb-4 text-center">
                  {step.title}
                </h3>
                
                <p className="text-gray-400 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA]"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}