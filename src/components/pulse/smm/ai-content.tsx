'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenLine, Copy, Check, Sparkles, AlertTriangle, Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const mockGeneratedContent = {
  postText: '☕ Утром — по делу, вечером — по душе!\n\nМы запускаем акцию, которая изменит ваш вечер. С 18:00 до 20:00 все кофейные напитки со скидкой 20%! 🎉\n\nПриходите с друзьями, берите любимый капучино и наслаждайтесь атмосферой Coffee & Co.\n\n📍 Мы рядом: Алматы, ул. Абая 45\n⏰ Акция действует до 10 февраля\n\n#coffee #акция #happyhour #алматы #coffeeco',
  storiesText:
    '☕ Только сегодня: −20% на ВСЕ кофейные напитки после 18:00!\n\n⏰ С 18:00 до 20:00\n📍 Coffee & Co, ул. Абая 45\n\nПоказывай этот Stories кассиру!',
  reelsScript:
    '[0:00-0:02] Динамичный заезд — вид на кофейню, музыка\n[0:02-0:04] Бариста готовит красивый латте-арт\n[0:04-0:06] Текст на экране: «Хочешь кофе со скидкой 20%?»\n[0:06-0:08] Счастливые клиенты пьют кофе\n[0:08-0:10] CTA: «Жми на ссылку в профиле!»',
  headline:
    '«Вечерний кофе за полцены — акция дня в Coffee & Co»',
  cta:
    'Делитесь с друзьями и приходите вечером — мы ждём вас! ☕✨',
  audienceNote:
    'Основная аудитория — 18–34 года. Предлагаем короткий, динамичный формат и молодёжную механику акции.',
};

type ContentType = keyof typeof mockGeneratedContent;

const contentSections: {
  key: ContentType;
  label: string;
  emoji: string;
}[] = [
  { key: 'postText', label: 'Пост', emoji: '📝' },
  { key: 'storiesText', label: 'Stories', emoji: '📱' },
  { key: 'reelsScript', label: 'Reels сценарий', emoji: '🎬' },
  { key: 'headline', label: 'Заголовок', emoji: '📌' },
  { key: 'cta', label: 'CTA', emoji: '🎯' },
];

export default function AIContent() {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 1500);
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
          <PenLine className="w-5 h-5 text-purple-400" />
        </div>
        <h1 className="text-2xl font-bold">AI Контент</h1>
      </motion.div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card>
          <CardContent className="p-4 space-y-3">
            <label className="text-sm font-medium">
              Опишите, что вы хотите продвинуть
            </label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Хочу акцию на кофе"
              className="text-base"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Генерация...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Создать контент
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generated Content */}
      <AnimatePresence>
        {generated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Content Sections */}
            {contentSections.map((section, i) => (
              <motion.div
                key={section.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <Card className="p-0">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{section.emoji}</span>
                        <h3 className="font-semibold text-sm">{section.label}</h3>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          handleCopy(section.key, mockGeneratedContent[section.key])
                        }
                      >
                        {copiedKey === section.key ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1 text-green-400" />
                            <span className="text-green-400">Скопировано</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 mr-1" />
                            Копировать
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                      {mockGeneratedContent[section.key]}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <Separator />

            {/* Audience Note */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Аудитория</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {mockGeneratedContent.audienceNote}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Disclaimer */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60 px-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>AI-генерация на основе демо-данных</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
