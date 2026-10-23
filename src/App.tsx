import { useState } from 'react';
import { ClosingInvitation } from './components/ClosingInvitation';
import { CoupleIntroduction } from './components/CoupleIntroduction';
import { FamilyIntroduction } from './components/FamilyIntroduction';
import { FloatingNav, PreviewBanner } from './components/FloatingNav';
import { HeroNames } from './components/HeroNames';
import { JourneyMap } from './components/JourneyMap';
import { PhotoGallery } from './components/PhotoGallery';
import { RoyalIntro } from './components/RoyalIntro';
import { RSVPForm } from './components/RSVPForm';
import { ScratchDateCard } from './components/ScratchDateCard';
import { ShlokaSection } from './components/ShlokaSection';
import { VenueDetails } from './components/VenueDetails';
import { WeddingTimeline } from './components/WeddingTimeline';

export default function App() {
  // Deep links (e.g. …/#venue shared on WhatsApp) skip the intro.
  const [introOpen, setIntroOpen] = useState(() => !window.location.hash);

  const closeIntro = () => {
    setIntroOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {introOpen && <RoyalIntro onDone={closeIntro} />}
      <main className={introOpen ? 'main--behind-intro' : 'main--entered'} aria-hidden={introOpen}>
        <PreviewBanner />
        {/* Scene order — see docs/STORYBOARD.md */}
        <HeroNames />
        <ShlokaSection />
        <CoupleIntroduction />
        <ScratchDateCard />
        <JourneyMap />
        <FamilyIntroduction />
        <WeddingTimeline />
        <VenueDetails />
        <PhotoGallery />
        <RSVPForm />
        <ClosingInvitation onReplay={() => setIntroOpen(true)} />
      </main>
      {!introOpen && <FloatingNav />}
    </>
  );
}
