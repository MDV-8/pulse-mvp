'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Zap, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

// ============================================================
// Constants
// ============================================================

const DEMO_EMAIL = 'demo@pulse.kz';
const DEMO_PASSWORD = 'Demo123';
const DEMO_NAME = 'Демо Пользователь';
const STORAGE_KEY_USERS = 'pulse-users';

interface StoredUser {
  email: string;
  name: string;
  password: string;
  isFirstTime: boolean;
}

function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUser(user: StoredUser) {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.email === user.email);
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

// ============================================================
// Form validation
// ============================================================

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  confirmPassword?: string;
  general?: string;
}

function validateLogin(email: string, password: string): FormErrors {
  const errors: FormErrors = {};
  if (!email.trim()) {
    errors.email = 'Введите email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Некорректный email';
  }
  if (!password) {
    errors.password = 'Введите пароль';
  } else if (password.length < 6) {
    errors.password = 'Минимум 6 символов';
  }
  return errors;
}

function validateRegister(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): FormErrors {
  const errors: FormErrors = {};
  if (!name.trim()) {
    errors.name = 'Введите имя';
  }
  if (!email.trim()) {
    errors.email = 'Введите email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Некорректный email';
  }
  if (!password) {
    errors.password = 'Введите пароль';
  } else if (password.length < 6) {
    errors.password = 'Минимум 6 символов';
  }
  if (!confirmPassword) {
    errors.confirmPassword = 'Подтвердите пароль';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают';
  }
  return errors;
}

// ============================================================
// Auth Screen Component
// ============================================================

export function AuthScreen() {
  const setAppMode = useAppStore((s) => s.setAppMode);
  const login = useAppStore((s) => s.login);
  const theme = useAppStore((s) => s.theme);

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Handlers
  const handleLogin = async () => {
    const validationErrors = validateLogin(loginEmail, loginPassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    // Check if account exists in localStorage
    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email === loginEmail.trim() && u.password === loginPassword
    );

    if (found) {
      login(found.email, found.name);
      if (found.isFirstTime) {
        // Mark as not first time
        saveUser({ ...found, isFirstTime: false });
      }
      toast.info('Для демонстрации используется тестовая компания Coffee & Co.');
      setAppMode('owner');
    } else {
      setLoading(false);
      setErrors({
        general: 'Неверный email или пароль. Зарегистрируйтесь, если у вас нет аккаунта.',
      });
    }
  };

  const handleRegister = async () => {
    const validationErrors = validateRegister(
      regName,
      regEmail,
      regPassword,
      regConfirmPassword
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    // Save user to localStorage
    saveUser({
      email: regEmail.trim(),
      name: regName.trim(),
      password: regPassword,
      isFirstTime: false,
    });

    login(regEmail.trim(), regName.trim());
    toast.info('Для демонстрации используется тестовая компания Coffee & Co.');
    setAppMode('owner');
  };

  const handleDemoLogin = () => {
    // Ensure demo user exists
    saveUser({
      email: DEMO_EMAIL,
      name: DEMO_NAME,
      password: DEMO_PASSWORD,
      isFirstTime: false,
    });

    login(DEMO_EMAIL, DEMO_NAME);
    setAppMode('owner');
  };

  const handleSkipAuth = () => {
    login('guest@pulse.kz', 'Гость');
    setAppMode('onboarding');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (activeTab === 'login') {
        handleLogin();
      } else {
        handleRegister();
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#8b5cf6]/[0.04] blur-[80px] animate-[blob-float-1_25s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#06b6d4]/[0.03] blur-[80px] animate-[blob-float-2_20s_ease-in-out_infinite]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/15 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#8b5cf6]" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight pulse-text-gradient">
              PULSE
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            AI Операционная система для бизнеса
          </p>
        </motion.div>

        {/* Auth Card */}
        <Card className="glass-card-deep rounded-2xl overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <Tabs
              value={activeTab}
              onValueChange={(v) => {
                setActiveTab(v as 'login' | 'register');
                setErrors({});
              }}
            >
              <TabsList className="w-full bg-white/[0.04] h-11 rounded-xl p-1 mb-6">
                <TabsTrigger
                  value="login"
                  className="flex-1 rounded-lg text-sm font-medium data-[state=active]:bg-[#8b5cf6] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#8b5cf6]/20 transition-all duration-200"
                >
                  Вход
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="flex-1 rounded-lg text-sm font-medium data-[state=active]:bg-[#8b5cf6] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#8b5cf6]/20 transition-all duration-200"
                >
                  Регистрация
                </TabsTrigger>
              </TabsList>

              {/* General Error */}
              <AnimatePresence>
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                      {errors.general}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ============ LOGIN TAB ============ */}
              <TabsContent value="login" className="mt-0 space-y-4">
                <motion.div
                  key="login-fields"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="login-email"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                        if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
                      }}
                      onKeyDown={handleKeyDown}
                      className="h-11 bg-white/[0.04] border-white/[0.08] focus:border-[#8b5cf6]/50 focus:ring-[#8b5cf6]/20 placeholder:text-muted-foreground/50 rounded-xl"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="login-password"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Пароль
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Введите пароль"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                        if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
                      }}
                      onKeyDown={handleKeyDown}
                      className="h-11 bg-white/[0.04] border-white/[0.08] focus:border-[#8b5cf6]/50 focus:ring-[#8b5cf6]/20 placeholder:text-muted-foreground/50 rounded-xl"
                      autoComplete="current-password"
                    />
                    {errors.password && (
                      <p className="text-xs text-destructive mt-1">{errors.password}</p>
                    )}
                  </div>

                  <Button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full h-11 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium rounded-xl shadow-lg shadow-[#8b5cf6]/20 transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Вход...
                      </>
                    ) : (
                      <>
                        Войти
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </TabsContent>

              {/* ============ REGISTER TAB ============ */}
              <TabsContent value="register" className="mt-0 space-y-4">
                <motion.div
                  key="register-fields"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-name"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Имя
                    </Label>
                    <Input
                      id="reg-name"
                      type="text"
                      placeholder="Ваше имя"
                      value={regName}
                      onChange={(e) => {
                        setRegName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      onKeyDown={handleKeyDown}
                      className="h-11 bg-white/[0.04] border-white/[0.08] focus:border-[#8b5cf6]/50 focus:ring-[#8b5cf6]/20 placeholder:text-muted-foreground/50 rounded-xl"
                      autoComplete="name"
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-email"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Email
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="your@email.com"
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      onKeyDown={handleKeyDown}
                      className="h-11 bg-white/[0.04] border-white/[0.08] focus:border-[#8b5cf6]/50 focus:ring-[#8b5cf6]/20 placeholder:text-muted-foreground/50 rounded-xl"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-password"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Пароль
                    </Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Минимум 6 символов"
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                      }}
                      onKeyDown={handleKeyDown}
                      className="h-11 bg-white/[0.04] border-white/[0.08] focus:border-[#8b5cf6]/50 focus:ring-[#8b5cf6]/20 placeholder:text-muted-foreground/50 rounded-xl"
                      autoComplete="new-password"
                    />
                    {errors.password && (
                      <p className="text-xs text-destructive mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-confirm"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Подтвердите пароль
                    </Label>
                    <Input
                      id="reg-confirm"
                      type="password"
                      placeholder="Повторите пароль"
                      value={regConfirmPassword}
                      onChange={(e) => {
                        setRegConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                      }}
                      onKeyDown={handleKeyDown}
                      className="h-11 bg-white/[0.04] border-white/[0.08] focus:border-[#8b5cf6]/50 focus:ring-[#8b5cf6]/20 placeholder:text-muted-foreground/50 rounded-xl"
                      autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full h-11 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium rounded-xl shadow-lg shadow-[#8b5cf6]/20 transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Создание...
                      </>
                    ) : (
                      <>
                        Создать аккаунт
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="section-divider my-5">
              <span className="divider-dot" />
            </div>

            {/* Demo login button */}
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleDemoLogin}
                variant="outline"
                className="w-full h-11 border-[#8b5cf6]/20 hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/5 text-[#8b5cf6] font-medium rounded-xl transition-all duration-200"
              >
                <Zap className="w-4 h-4 mr-2" />
                Демо вход
              </Button>
            </motion.div>

            {/* Skip auth link */}
            <div className="text-center mt-5">
              <button
                onClick={handleSkipAuth}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 underline-offset-4 hover:underline"
              >
                Войти без аккаунта
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-muted-foreground/60 mt-6"
        >
          © 2025 PULSE · Казахстан
        </motion.p>
      </motion.div>
    </div>
  );
}
