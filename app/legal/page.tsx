'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Shield, Brain, Database, Lock, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<'tos' | 'privacy'>('tos')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateFromHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'privacy' || hash === 'tos') {
        setActiveTab(hash)
      }
    }

    updateFromHash()
    window.addEventListener('hashchange', updateFromHash)
    return () => window.removeEventListener('hashchange', updateFromHash)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const desiredHash = activeTab === 'privacy' ? '#privacy' : '#tos'
    if (window.location.hash !== desiredHash) {
      window.history.replaceState(null, '', desiredHash)
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <img src="/assets/brain-logo-landing.png" alt="EPI Brain" className="h-10 w-10 object-contain" />
            <span className="text-xl font-semibold text-foreground">EPI Brain</span>
          </div>
          <nav className="flex gap-4 text-sm">
            <a
              href="https://www.epibraingenius.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </a>
            <a
              href="https://www.epibraingenius.com/use-cases"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Use Cases
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-5xl px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Legal Information</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparency and trust are at the core of EPI Brain. Review our terms and privacy commitments.
          </p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-border">
          <Button
            variant={activeTab === 'tos' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('tos')}
            className="rounded-b-none relative"
          >
            <Shield className="h-4 w-4" />
            Terms of Service
          </Button>
          <Button
            variant={activeTab === 'privacy' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('privacy')}
            className="rounded-b-none"
          >
            <Lock className="h-4 w-4" />
            Privacy Policy
          </Button>
        </div>

        {activeTab === 'tos' && (
          <div className="space-y-8 animate-fadeIn duration-300">
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-foreground">Terms of Service</h2>
                  <p className="text-sm text-muted-foreground">Last Updated: February 2025</p>
                </div>

                <Card className="border-l-4 border-l-accent bg-accent/10 p-6">
                  <div className="flex gap-4">
                    <AlertCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-foreground">Medical &amp; Professional Disclaimer</h3>
                      <p className="text-sm leading-relaxed text-foreground/90">
                        EPI Brain provides AI-driven support including a <strong>Psychology Expert</strong> and <strong>Business Mentor</strong>.
                        These are <u>not</u> replacements for licensed therapy, medical advice, or professional legal/financial consulting.
                        If you are experiencing a mental health crisis, please contact emergency services immediately or call the 988 Suicide &amp;
                        Crisis Lifeline.
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <UserCheck className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-foreground">1. Acceptance of Terms</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        By accessing <strong className="text-foreground">EPI Brain</strong>, provided by Twin Wicks Digital Solutions,
                        you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our AI
                        personalities. We reserve the right to modify these terms at any time, and continued use of the service constitutes
                        acceptance of any changes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-foreground">2. AI-Generated Content</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        EPI Brain utilizes advanced machine learning models to provide personalized AI interactions. You acknowledge and agree
                        that:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                        <li>AI output may occasionally be inaccurate, incomplete, biased, or objectionable</li>
                        <li>The AI does not have access to real-time information unless explicitly stated</li>
                        <li>You are solely responsible for verifying any information provided by the AI before acting on it</li>
                        <li>AI responses should not be considered professional advice of any kind</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-foreground">3. Use of AI Personalities</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Users are granted a limited, non-exclusive, non-transferable license to interact with our 9 specialized AI personalities for
                        personal growth, business training, and educational purposes. You agree to:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                        <li>Use the service only for lawful purposes</li>
                        <li>Not attempt to reverse engineer, copy, or replicate our AI models</li>
                        <li>Not use the service to generate harmful, illegal, defamatory, or deceptive content</li>
                        <li>Not attempt to bypass usage limits or access restrictions</li>
                        <li>Respect intellectual property rights in all interactions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-foreground">4. Semantic Memory &amp; User Accountability</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Our <strong className="text-foreground">Semantic Memory</strong> feature allows the AI to remember context, preferences, and key
                        information across sessions to provide a more personalized experience. Important notes:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                        <li>You are responsible for all information you choose to share with the AI</li>
                        <li>Memory can be cleared or reset at any time through your account settings</li>
                        <li>We reserve the right to modify or reset memory parameters to maintain system integrity</li>
                        <li>Semantic memory is stored securely but should not be used for highly sensitive information</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">5. Mental Health &amp; Crisis Resources</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      While our Psychology Expert personality can provide general mental health education and support, it is not a substitute for
                      professional mental healthcare. If you are in crisis:
                    </p>
                    <Card className="bg-secondary/50 p-4 space-y-2">
                      <p className="text-sm font-semibold text-foreground">Emergency Resources:</p>
                      <p className="text-sm text-muted-foreground">• US: 988 Suicide &amp; Crisis Lifeline</p>
                      <p className="text-sm text-muted-foreground">• Crisis Text Line: Text HOME to 741741</p>
                      <p className="text-sm text-muted-foreground">• Emergency Services: 911</p>
                      <p className="text-sm text-muted-foreground">• International: Find resources at findahelpline.com</p>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">6. Limitation of Liability</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      To the maximum extent permitted by law, EPI Brain and Twin Wicks Digital Solutions shall not be liable for any indirect,
                      incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. This includes
                      but is not limited to decisions made based on AI advice, data loss, or service interruptions.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">7. Termination</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We reserve the right to terminate or suspend your access to EPI Brain at any time, without prior notice, for conduct that
                      we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason at our
                      sole discretion.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-8 animate-fadeIn duration-300">
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-foreground">Privacy Policy</h2>
                  <p className="text-sm text-muted-foreground">Last Updated: February 2025</p>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  At EPI Brain, we take your privacy seriously. This Privacy Policy explains how we collect, use, protect, and share
                  information about you when you use our AI personality platform.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-foreground">1. Data We Collect</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        We collect information you provide directly to us when using EPI Brain, including:
                      </p>
                      <div className="space-y-3">
                        <Card className="bg-secondary/30 p-4">
                          <h4 className="font-semibold text-foreground mb-2">Conversation Data</h4>
                          <p className="text-sm text-muted-foreground">
                            All text, prompts, and messages you input when interacting with our AI personalities. This includes questions,
                            personal information you choose to share, and feedback.
                          </p>
                        </Card>
                        <Card className="bg-secondary/30 p-4">
                          <h4 className="font-semibold text-foreground mb-2">Semantic Memory</h4>
                          <p className="text-sm text-muted-foreground">
                            Key details, preferences, and context that the AI remembers across sessions to provide a tailored experience. You have
                            full control over this data.
                          </p>
                        </Card>
                        <Card className="bg-secondary/30 p-4">
                          <h4 className="font-semibold text-foreground mb-2">Account Information</h4>
                          <p className="text-sm text-muted-foreground">
                            Your name, email address, authentication credentials, progress tracking metrics, subscription status, and usage
                            statistics.
                          </p>
                        </Card>
                        <Card className="bg-secondary/30 p-4">
                          <h4 className="font-semibold text-foreground mb-2">Technical Data</h4>
                          <p className="text-sm text-muted-foreground">
                            IP address, browser type, device information, session duration, and interaction patterns for service improvement and
                            security purposes.
                          </p>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-foreground">2. How We Use Your Data</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        We use your data to provide, improve, and personalize the EPI Brain experience:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                        <li>Provide context-aware, personalized AI responses tailored to your needs</li>
                        <li>Track your goals, habits, and personal growth progress across sessions</li>
                        <li>Improve our AI models through aggregated, anonymized training data</li>
                        <li>Send important service updates, security alerts, and account notifications</li>
                        <li>Detect and prevent fraud, abuse, and security threats</li>
                        <li>Comply with legal obligations and enforce our Terms of Service</li>
                      </ul>
                      <Card className="mt-4 bg-primary/10 border-primary/20 p-4">
                        <p className="text-sm font-semibold text-foreground mb-1">Our Commitment:</p>
                        <p className="text-sm text-foreground/90">
                          <strong>We do not sell your personal conversation data to third parties.</strong> Your interactions with EPI Brain remain
                          private and are used solely to improve your experience.
                        </p>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-foreground">3. Privacy-First Approach &amp; Data Control</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        As part of our Privacy-First philosophy, you have complete control over your data:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="bg-secondary/30 p-4">
                          <h4 className="flex items-center gap-2 font-semibold text-foreground mb-2">
                            <UserCheck className="h-4 w-4" />
                            Access Your Data
                          </h4>
                          <p className="text-sm text-muted-foreground">Request a copy of all data we have stored about you at any time.</p>
                        </Card>
                        <Card className="bg-secondary/30 p-4">
                          <h4 className="flex items-center gap-2 font-semibold text-foreground mb-2">
                            <Database className="h-4 w-4" />
                            Clear Memory
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Delete your AI Semantic Memory and start fresh whenever you choose.
                          </p>
                        </Card>
                        <Card className="bg-secondary/30 p-4">
                          <h4 className="flex items-center gap-2 font-semibold text-foreground mb-2">
                            <AlertCircle className="h-4 w-4" />
                            Delete Conversations
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Remove specific conversations or your entire conversation history.
                          </p>
                        </Card>
                        <Card className="bg-secondary/30 p-4">
                          <h4 className="flex items-center gap-2 font-semibold text-foreground mb-2">
                            <Lock className="h-4 w-4" />
                            Account Deletion
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all associated data.
                          </p>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-foreground">4. Data Security</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        We implement industry-standard security measures to protect your sensitive interactions:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                        <li>End-to-end encryption for data transmission</li>
                        <li>Encrypted storage of conversation data and semantic memory</li>
                        <li>Regular security audits and vulnerability assessments</li>
                        <li>Access controls and authentication mechanisms</li>
                        <li>Secure data centers with physical and digital safeguards</li>
                      </ul>
                      <Card className="mt-4 bg-accent/10 border-accent/20 p-4">
                        <div className="flex gap-3">
                          <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground/90">
                            <strong>Important:</strong> While we implement robust security measures, no internet transmission is 100% secure. Use caution
                            when sharing highly sensitive personal details such as passwords, financial information, or medical records.
                          </p>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">5. Data Sharing &amp; Third Parties</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      We may share limited data with trusted third-party service providers who assist in operating our platform:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Cloud infrastructure providers (data hosting and storage)</li>
                      <li>Analytics services (aggregated usage statistics only)</li>
                      <li>Payment processors (for subscription management)</li>
                      <li>AI model providers (for processing interactions)</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mt-3">
                      All third-party providers are contractually obligated to protect your data and use it only for specified purposes. We will never
                      sell your personal conversation data to advertisers or data brokers.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">6. Data Retention</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We retain your data only as long as necessary to provide services and fulfill the purposes outlined in this policy. Conversation
                      history is retained until you delete it or close your account. Semantic memory is cleared when you request it. After account
                      deletion, we may retain minimal anonymized data for legal compliance and fraud prevention.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">7. Children's Privacy</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      EPI Brain is not intended for children under 13 years of age. We do not knowingly collect personal information from children.
                      If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">8. Your Rights (GDPR &amp; CCPA)</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Depending on your location, you may have additional rights under data protection laws:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Right to access: Request a copy of your personal data</li>
                      <li>Right to rectification: Correct inaccurate personal data</li>
                      <li>Right to erasure: Request deletion of your personal data</li>
                      <li>Right to restriction: Limit how we use your data</li>
                      <li>Right to data portability: Receive your data in a structured format</li>
                      <li>Right to object: Opt-out of certain data processing activities</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">9. Contact Us</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us:
                    </p>
                    <Card className="bg-secondary/30 p-4">
                      <p className="text-sm text-foreground">
                        <strong>Twin Wicks Digital Solutions</strong>
                      </p>
                      <p className="text-sm text-muted-foreground">Email: privacy@epibraingenius.com</p>
                      <p className="text-sm text-muted-foreground">Website: www.epibraingenius.com</p>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        <footer className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">
            &copy; 2025 EPI Brain. Built by{' '}
            <a
              href="https://www.epibraingenius.com/use-cases"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twin Wicks Digital Solutions
            </a>
          </p>
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            EPI Brain is an AI-powered platform providing educational and informational support. It is not a substitute for professional
            medical, legal, or financial advice.
          </p>
        </footer>
      </main>
    </div>
  )
}
