import { Users, Brain, Target, Lock, Clock, Zap } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: "9 Specialized Personalities",
    description: "Unlike generic AI chatbots, EPI Brain offers 9 distinct personalities specifically trained for different life areas - business, learning, fitness, mental health, faith, and more."
  },
  {
    icon: Brain,
    title: "Semantic Memory Across Conversations",
    description: "Our AI remembers important details across all your conversations while maintaining privacy. Context-aware responses that evolve with you."
  },
  {
    icon: Target,
    title: "Accountability & Goal Tracking",
    description: "Built-in goal setting, habit tracking, and accountability systems. Your AI companion helps you stay on track and celebrates your progress."
  },
  {
    icon: Clock,
    title: "24/7 Instant Availability",
    description: "No appointment needed. Your AI companion is always ready to help, whether it's 3 AM business strategy or midnight emotional support."
  },
  {
    icon: Lock,
    title: "Privacy-First Approach",
    description: "Your conversations are secure and private. Full control over your memory settings and data. Safety layers for sensitive topics."
  },
  {
    icon: Zap,
    title: "Adaptive Personality System",
    description: "AI adapts its tone and approach based on your preferences, conversation depth, and current state. Support that evolves with you."
  }
];

export default function WhyChooseEPI() {
  return (
    <section className="container mx-auto px-6 py-20" aria-labelledby="why-choose-heading">
      <h2 id="why-choose-heading" className="text-4xl font-bold text-white text-center mb-6">
        Why Choose EPI Brain?
      </h2>
      <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
        Discover what makes EPI Brain different from generic AI assistants
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-[#2d1b4e] border border-[#7B3FF2]/20 rounded-xl p-8 hover:border-[#7B3FF2] transition-all hover:shadow-lg hover:shadow-[#7B3FF2]/20 group"
            >
              <div className="w-16 h-16 bg-[#7B3FF2]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="text-[#7B3FF2]" size={32} />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}