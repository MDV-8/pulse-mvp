'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ── Types ─────────────────────────────────────────────────

interface FeedbackPopupProps {
  open: boolean;
  onClose: () => void;
}

interface EmojiOption {
  emoji: string;
  label: string;
  value: number;
}

// ── Data ───────────────────────────────────────────────────

const EMOJI_OPTIONS: EmojiOption[] = [
  { emoji: '😍', label: 'Отлично', value: 5 },
  { emoji: '😊', label: 'Хорошо', value: 4 },
  { emoji: '😐', label: 'Нормально', value: 3 },
  { emoji: '😕', label: 'Можно лучше', value: 2 },
];

// ── Overlay / backdrop animation ──────────────────────────

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const popupVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 28 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// ── Component ──────────────────────────────────────────────

export function FeedbackPopup({ open, onClose }: FeedbackPopupProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(() => {
    if (rating === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setSelectedEmoji(null);
      setComment('');
      onClose();
    }, 2000);
  }, [rating, onClose]);

  const handleSkip = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleSkip}
          />

          {/* Popup Card */}
          <motion.div
            className={
              'relative w-full max-w-md glass-card-premium rounded-2xl p-6 sm:p-8 ' +
              'shadow-2xl shadow-purple-500/10'
            }
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                /* ── Success State ──────────────────────────── */
                <motion.div
                  key="success"
                  className="flex flex-col items-center justify-center py-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                      delay: 0.1,
                    }}
                  >
                    <Check className="w-10 h-10 text-green-400" />
                  </motion.div>
                  <p className="text-lg font-bold text-green-400">
                    Спасибо за обратную связь!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Это помогает нам становиться лучше
                  </p>
                </motion.div>
              ) : (
                /* ── Feedback Form ──────────────────────────── */
                <motion.div
                  key="form"
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold pulse-text-gradient">
                      Как вам PULSE?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Ваше мнение помогает нам улучшаться
                    </p>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled =
                        star <= (hoveredStar || rating);
                      return (
                        <motion.button
                          key={star}
                          type="button"
                          className="focus:outline-none micro-interaction"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.95 }}
                          onMouseEnter={() =>
                            setHoveredStar(star)
                          }
                          onMouseLeave={() =>
                            setHoveredStar(0)
                          }
                          onClick={() => setRating(star)}
                        >
                          <Star
                            className={`w-8 h-8 transition-colors duration-150 ${
                              isFilled
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                  {rating > 0 && (
                    <motion.p
                      className="text-center text-xs text-muted-foreground"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {rating} из 5
                    </motion.p>
                  )}

                  {/* Emoji Quick Feedback */}
                  <div className="flex items-center justify-center gap-3">
                    {EMOJI_OPTIONS.map((opt) => (
                      <motion.button
                        key={opt.value}
                        type="button"
                        className={
                          'flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ' +
                          'focus:outline-none ' +
                          (selectedEmoji === opt.value
                            ? 'bg-purple-500/20 ring-1 ring-purple-500/40'
                            : 'hover:bg-muted/60')
                        }
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedEmoji(opt.value)}
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {opt.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Text Input */}
                  <div className="glass-card rounded-xl p-3">
                    <textarea
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none min-h-[72px]"
                      placeholder="Расскажите подробнее..."
                      value={comment}
                      onChange={(e) =>
                        setComment(e.target.value)
                      }
                      rows={3}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white"
                      disabled={rating === 0}
                      onClick={handleSubmit}
                    >
                      Отправить
                    </Button>
                    <Button
                      variant="outline"
                      className="border-border text-muted-foreground hover:text-foreground"
                      onClick={handleSkip}
                    >
                      Пропустить
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
