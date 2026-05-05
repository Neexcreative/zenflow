import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import WidgetCard from '../WidgetCard'

const QUOTES = [
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Focus is the art of knowing what to ignore.', author: 'James Clear' },
  { text: 'Deep work is the superpower of the 21st century.', author: 'Cal Newport' },
  { text: "You don't rise to the level of your goals, you fall to the level of your systems.", author: 'James Clear' },
  { text: 'The ability to perform deep work is becoming increasingly rare.', author: 'Cal Newport' },
  { text: 'Flow is being completely involved in an activity for its own sake.', author: 'Mihaly Csikszentmihalyi' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { text: 'Schedule your priorities before the world schedules them for you.', author: 'Stephen Covey' },
  { text: 'Energy, not time, is the fundamental currency of high performance.', author: 'Jim Loehr' },
  { text: "It's not about having time. It's about making time.", author: 'Unknown' },
  { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln' },
  { text: 'Clarity creates momentum.', author: 'Brendon Burchard' },
  { text: 'A focused mind is a creative mind.', author: 'Rick Rubin' },
  { text: 'The quieter you become, the more you can hear.', author: 'Ram Dass' },
  { text: 'Small daily improvements are the key to staggering long-term results.', author: 'Robin Sharma' },
  { text: 'The best systems feel simple on the surface and rigorous underneath.', author: 'Unknown' },
  { text: 'Creativity loves constraints.', author: 'Austin Kleon' },
  { text: 'Attention is the beginning of devotion.', author: 'Mary Oliver' },
  { text: 'Rest is not a reward. It is part of the process.', author: 'Unknown' },
  { text: 'Consistency compounds faster than intensity.', author: 'Unknown' },
  { text: 'A calm environment can sharpen a restless mind.', author: 'Unknown' },
  { text: 'Your rituals decide your results.', author: 'Unknown' },
  { text: 'What you repeat becomes what you remember.', author: 'Unknown' },
  { text: 'Make the important obvious and the unnecessary invisible.', author: 'Unknown' },
  { text: 'Depth is built in minutes that feel protected.', author: 'Unknown' },
  { text: 'Creative flow starts where distraction ends.', author: 'Unknown' },
  { text: 'Elegance is subtraction with intention.', author: 'Unknown' },
  { text: 'If you want a better tomorrow, design a better today.', author: 'Unknown' },
  { text: 'The most productive room is often the quietest one.', author: 'Unknown' },
  { text: 'Progress loves a system it can trust.', author: 'Unknown' },
]

export default function QuoteWidget() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUOTES.length))
  const [key, setKey] = useState(0)

  const next = () => {
    setIndex((current) => (current + 1) % QUOTES.length)
    setKey((current) => current + 1)
  }

  return (
    <WidgetCard
      title="Quote"
      headerRight={
        <button onClick={next} className="icon-button quote-refresh" title="Next quote">
          <RefreshCw size={14} />
        </button>
      }
    >
      <div className="quote-widget">
        <div className="quote-mark">"</div>
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <p className="quote-text">{QUOTES[index].text}</p>
            <p className="quote-author">- {QUOTES[index].author}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </WidgetCard>
  )
}
