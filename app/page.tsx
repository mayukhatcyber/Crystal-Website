"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Award, Building, CheckCircle, Clock, Mail, MapPin, Menu, Phone, X, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnimatedSection } from "@/components/animated-section"
import { AnimatedText } from "@/components/animated-text"
import { AnimatedCounter } from "@/components/animated-counter"
import { AnimatedBackground } from "@/components/animated-background"
import { useMobile } from "@/hooks/use-mobile"
import { SkipLink } from "@/components/skip-link"
import { FocusTrap } from "@/components/focus-trap"
import { AccessibleContactForm } from "@/components/accessible-form"
import { VoiceCommandButton } from "@/components/voice-command-button"
import { VoiceFeedback } from "@/components/voice-feedback"
import { VoiceNavigationHandler } from "@/components/voice-navigation-handler"
import { VoiceFormHandler } from "@/components/voice-form-handler"
import { VoiceTutorial } from "@/components/voice-tutorial"

export default function Home() {
  const isMobile = useMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [mobileMenuOpen])

  return (
    <div className="flex flex-col min-h-screen">
      <SkipLink />
      <AnimatedBackground />

      {/* Voice command components */}
      <VoiceCommandButton />
      <VoiceFeedback />
      <VoiceNavigationHandler />
      <VoiceFormHandler />
      <VoiceTutorial />

      <header
        className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${
          scrolled ? "bg-background/95 shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <img src="https://tinyurl.com/logocrystal" alt="Logo" className="h-6 w-6" />
            <span className="text-xl font-bold">Crystal Engineering</span>
          </motion.div>

          <nav className="hidden md:flex gap-6">
            {["Home", "Services", "Projects", "About", "Contact"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * i }}
              >
                <Link
                  href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                  className="text-sm font-medium transition-colors hover:text-primary relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              aria-hidden="true"
            >
              <ThemeToggle />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden md:block"
            >
              <Button asChild className="relative overflow-hidden group">
                <Link href="#contact">
                  <span className="relative z-10">Get a Quote</span>
                  <span className="absolute inset-0 bg-primary-foreground opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                </Link>
              </Button>
            </motion.div>

            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Toggle menu</span>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <FocusTrap isActive={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <img src="https://tinyurl.com/logocrystal" alt="Logo" className="h-6 w-6" />
                    <span className="text-xl font-bold">Crystal Engineering</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <div className="flex flex-col gap-4 p-6">
                  {["Home", "Services", "Projects", "About", "Contact"].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * i }}
                    >
                      <Link
                        href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                        className="text-lg font-medium block py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item}
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="mt-4"
                  >
                    <Button asChild className="w-full">
                      <Link href="#contact" onClick={() => setMobileMenuOpen(false)}>
                        Get a Quote
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </FocusTrap>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" className="flex-1" tabIndex={-1}>
        <section
          className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden"
          role="region"
          aria-labelledby="hero-heading"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent dark:from-blue-900/20 -z-10"></div>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <AnimatedSection delay={0.1}>
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-sm text-blue-800 dark:text-blue-300"
                  >
                    Govt. Registered Contractors
                  </motion.div>
                  <AnimatedText
                    text="Powering Infrastructure with Electrical Excellence"
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                  />
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-muted-foreground md:text-xl"
                  >
                    Crystal Engineering specializes in all types of substation-based electrical jobs, delivering
                    reliable and efficient solutions for government and private sector projects.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-col gap-2 min-[400px]:flex-row"
                  >
                    <Button asChild size="lg" className="group relative overflow-hidden">
                      <Link href="#contact">
                        <span className="relative z-10 flex items-center">
                          Request a Consultation
                          <motion.span
                            initial={{ x: 0 }}
                            animate={{ x: [0, 5, 0] }}
                            transition={{
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                              duration: 1.5,
                              repeatDelay: 1,
                            }}
                          >
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </motion.span>
                        </span>
                        <span className="absolute inset-0 bg-primary-foreground opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="relative overflow-hidden group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <Link href="#services">
                        <span className="relative z-10">Explore Our Services</span>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full"></span>
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.3}>
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    type: "spring",
                    damping: 15,
                  }}
                  src="https://tinyurl.com/crystalce"
                  alt="Electrical substation"
                  className="mx-auto w-full max-w-[700px] h-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last shadow-lg shadow-blue-500/10 dark:shadow-blue-900/20"
                />
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 relative" role="region" aria-labelledby="stats-heading">
          <div className="container px-4 md:px-6">
            <AnimatedSection>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12">
                <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
                  <h3 className="text-3xl font-bold text-primary mb-1">
                    <AnimatedCounter from={0} to={9} formatter={(value) => `${Math.floor(value)}+`} />
                  </h3>
                  <p className="text-muted-foreground">Years Experience</p>
                </div>
                <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
                  <h3 className="text-3xl font-bold text-primary mb-1">
                    <AnimatedCounter from={0} to={50} formatter={(value) => `${Math.floor(value)}+`} />
                  </h3>
                  <p className="text-muted-foreground">Projects Completed</p>
                </div>
                <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
                  <h3 className="text-3xl font-bold text-primary mb-1">
                    <AnimatedCounter from={0} to={15} formatter={(value) => `${Math.floor(value)}+`} />
                  </h3>
                  <p className="text-muted-foreground">Govt. Partnerships</p>
                </div>
                <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
                  <h3 className="text-3xl font-bold text-primary mb-1">
                    <AnimatedCounter from={0} to={100} formatter={(value) => `${Math.floor(value)}%`} />
                  </h3>
                  <p className="text-muted-foreground">Client Satisfaction</p>
                </div>
              </div>
            </AnimatedSection>

            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <AnimatedSection>
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-sm text-blue-800 dark:text-blue-300">
                    Our Services
                  </div>
                  <h2 id="stats-heading" className="text-3xl font-bold tracking-tighter md:text-4xl">
                    Comprehensive Electrical Solutions
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    We provide end-to-end services for all types of substation-based electrical projects
                  </p>
                </div>
              </AnimatedSection>
            </div>

            <div id="services" className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {[
                {
                  icon: <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
                  title: "Substation Installation",
                  description:
                    "Complete design and installation of new electrical substations for government and industrial projects.",
                },
                {
                  icon: <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
                  title: "Maintenance & Repair",
                  description:
                    "Scheduled maintenance and emergency repair services for existing substation infrastructure.",
                },
                {
                  icon: <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
                  title: "Upgrades & Modernization",
                  description: "Upgrading outdated electrical systems with modern, efficient technology and equipment.",
                },
                {
                  icon: <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
                  title: "Testing & Commissioning",
                  description: "Comprehensive testing and commissioning services to ensure safety and compliance.",
                },
                {
                  icon: <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
                  title: "Consultancy Services",
                  description:
                    "Expert advice and planning for electrical infrastructure projects and compliance requirements.",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-blue-600 dark:text-blue-400"
                    >
                      <path d="M12 22v-5" />
                      <path d="M9 8V2" />
                      <path d="M15 8V2" />
                      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
                    </svg>
                  ),
                  title: "Power Distribution",
                  description:
                    "Design and implementation of efficient power distribution networks for various applications.",
                },
              ].map((service, index) => (
                <AnimatedSection key={index} delay={0.1 * index}>
                  <motion.div
                    className="flex flex-col items-center space-y-4 rounded-lg border p-6 bg-card transition-all duration-300 hover:shadow-md hover:shadow-blue-500/5 dark:hover:shadow-blue-900/10"
                    whileHover={{ y: -5 }}
                  >
                    <motion.div
                      className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3"
                      whileHover={{
                        rotate: [0, 10, -10, 0],
                        transition: { duration: 0.5 },
                      }}
                    >
                      {service.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="text-center text-muted-foreground">{service.description}</p>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section
          id="projects"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 relative"
          role="region"
          aria-labelledby="projects-heading"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent dark:from-blue-900/10 -z-10"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <AnimatedSection>
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-sm text-blue-800 dark:text-blue-300">
                    Our Projects
                  </div>
                  <h2 id="projects-heading" className="text-3xl font-bold tracking-tighter md:text-4xl">
                    Featured Work
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Explore some of our recent substation and electrical infrastructure projects
                  </p>
                </div>
              </AnimatedSection>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {[
                {
                  image: "/placeholder.svg?height=400&width=600",
                  title: "Government Substation Project",
                  description: "132kV Substation Installation for Municipal Corporation",
                },
                {
                  image: "/placeholder.svg?height=400&width=600",
                  title: "Industrial Power Distribution",
                  description: "Complete Electrical System for Manufacturing Plant",
                },
                {
                  image: "/placeholder.svg?height=400&width=600",
                  title: "Substation Modernization",
                  description: "Upgrading Legacy Systems with Smart Grid Technology",
                },
              ].map((project, index) => (
                <AnimatedSection key={index} delay={0.15 * index}>
                  <motion.div
                    className="group relative overflow-hidden rounded-lg shadow-lg"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      width={600}
                      height={400}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300">
                      <div className="absolute bottom-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-bold text-white">{project.title}</h3>
                        <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.5}>
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  className="group relative overflow-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <span className="relative z-10">View All Projects</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full"></span>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32" role="region" aria-labelledby="about-heading">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <AnimatedSection>
                <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-sm text-blue-800 dark:text-blue-300">
                    About Us
                  </div>
                  <h2 id="about-heading" className="text-3xl font-bold tracking-tighter md:text-4xl">
                    Crystal Engineering
                  </h2>
                  <p className="text-muted-foreground md:text-xl">
                    With over 9 years of experience in the electrical engineering sector, Crystal Engineering has
                    established itself as a trusted name in substation-based electrical service provider.
                  </p>
                  <p className="text-muted-foreground">
                    As a government-registered contractor, we adhere to the highest standards of quality and safety in
                    all our projects. Our team of certified engineers and technicians brings expertise and dedication to
                    every job, ensuring reliable and efficient electrical solutions.
                  </p>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Our Credentials</h3>
                    <ul className="space-y-2">
                      {[
                        "Government Registered Electrical Contractor",
                        "MSME Certified",
                        "Certified Electrical Safety Professionals",
                        "Approved Vendor for Multiple Government Departments",
                      ].map((credential, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 * index }}
                          viewport={{ once: true }}
                          className="flex items-center"
                        >
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <CheckCircle className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </motion.div>
                          <span>{credential}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <motion.img
                  initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.8,
                    type: "spring",
                    damping: 15,
                  }}
                  viewport={{ once: true }}
                  src="https://tinyurl.com/propce"
                  alt="Crystal Engineering team"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full shadow-lg shadow-blue-500/10 dark:shadow-blue-900/20"
                  width={550}
                  height={310}
                />
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 relative"
          role="region"
          aria-labelledby="contact-heading"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent dark:from-blue-900/10 -z-10"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <AnimatedSection>
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-sm text-blue-800 dark:text-blue-300">
                    Contact Us
                  </div>
                  <h2 id="contact-heading" className="text-3xl font-bold tracking-tighter md:text-4xl">
                    Get in Touch
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Reach out to discuss your electrical infrastructure needs
                  </p>
                </div>
              </AnimatedSection>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 mt-8">
              <AnimatedSection delay={0.1}>
                <div className="space-y-6">
                  {[
                    {
                      icon: <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
                      title: "Our Office",
                      content: "263 Upendra Nath Banerjee Road, mail 239/3 Upen Banerjee Road, Kolkata-700060",
                    },
                    {
                      icon: <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
                      title: "Phone",
                      content: "+91 9748440070",
                    },
                    {
                      icon: <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
                      title: "Email",
                      content: "crystalengineering3972@gmail.com",
                    },
                  ].map((contact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-4"
                    >
                      <motion.div
                        className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3"
                        whileHover={{
                          rotate: [0, 10, -10, 0],
                          transition: { duration: 0.5 },
                        }}
                      >
                        {contact.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-bold">{contact.title}</h3>
                        <p className="text-muted-foreground">{contact.content}</p>
                      </div>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="rounded-lg border p-6 bg-card shadow-sm"
                  >
                    <h3 className="text-lg font-bold mb-2">Business Hours</h3>
                    <div className="space-y-2">
                      {[
                        { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
                        { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
                        { day: "Sunday", hours: "Closed" },
                      ].map((schedule, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          className="flex justify-between"
                        >
                          <span>{schedule.day}</span>
                          <span>{schedule.hours}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <AccessibleContactForm />
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-background py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <img src="https://tinyurl.com/logocrystal" alt="Logo" className="h-6 w-6" />
            <span className="text-xl font-bold">Crystal Engineering</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-sm text-muted-foreground md:text-left"
          >
            © {new Date().getFullYear()} Crystal Engineering. All rights reserved. Govt. Registered Electrical
            Contractors.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-4"
          >
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                ),
                name: "Facebook",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                ),
                name: "Instagram",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                ),
                name: "Twitter",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                ),
                name: "LinkedIn",
              },
            ].map((social, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
