import { HeroSection } from '@/components/HeroSection'
import { FeatureSection } from '@/components/FeatureSection'
import { GallerySection } from '@/components/GallerySection'
import { FAQ } from '@/components/FAQ'

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <GallerySection />
      <FAQ
        items={[
          {
            question: 'What is the best AI travel planner?',
            answer: 'Nyala is a free AI travel planner that creates personalized travel itineraries with real attractions, hotels, and activities. Our AI travel assistant helps you plan your perfect trip effortlessly.'
          },
          {
            question: 'Is an AI trip planner free to use?',
            answer: 'Yes! Nyala offers a free AI travel planner. Generating AI travel itineraries is completely free. Premium features are coming soon.'
          },
          {
            question: 'How can I use AI to plan a vacation?',
            answer: 'Simply enter your destination, travel dates, and preferences on our AI travel planner page. Our AI travel assistant will generate a personalized itinerary with attractions, restaurants, and accommodation suggestions.'
          },
          {
            question: 'Can AI replace travel agents?',
            answer: 'While AI travel planners like Nyala can create detailed itineraries quickly, they complement rather than replace human travel agents. Our AI travel assistant provides instant, personalized trip planning that adapts to your needs.'
          },
          {
            question: 'Does Nyala book hotels directly?',
            answer: 'Nyala finds top hotels and provides trusted booking links so you can reserve securely.'
          },
          {
            question: 'Can I save itineraries and attractions?',
            answer: 'Yes. Use the Save button on itineraries and the heart on attraction cards to add to your collections.'
          }
        ]}
      />
    </>
  )
}