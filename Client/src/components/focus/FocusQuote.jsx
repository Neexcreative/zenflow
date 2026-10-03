import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { QUOTES } from '../../data/quotes'

export default function FocusQuote() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUOTES.length))
  const quote = QUOTES[index]

  return (
    <button
      type="button"
      className="focus-quote"
      onClick={() => setIndex((current) => (current + 1) % QUOTES.length)}
      title="Show another quote"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          className="focus-quote__inner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <q className="focus-quote__text">{quote.text}</q>
          {quote.author && quote.author !== 'Unknown' ? (
            <span className="focus-quote__author">{quote.author}</span>
          ) : null}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
