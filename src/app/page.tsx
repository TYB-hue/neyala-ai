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
            question: 'Does Nyala book hotels directly?',
            answer: 'Nyala finds top hotels and provides trusted booking links so you can reserve securely.'
          },
          {
            question: 'Is Nyala free to use?',
            answer: 'Yes, generating itineraries is free. Premium features are coming soon.'
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