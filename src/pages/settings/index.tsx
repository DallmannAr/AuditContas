// src/pages/Settings/index.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Monitor, Bell, BellOff, Save, Globe, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/translations';
import type { Language } from '@/lib/translations';
import { se } from 'date-fns/locale';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, showSuccess } = useApp();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };

  const handleLanguageChange = (language: Language) => {
    updateSettings({ language });
    showSuccess(
      t.settings.savedSuccess,
      `${t.toast.languageSettingToast} ${getLanguageName(language)}`
    );
  };

  const getLanguageName = (lang: Language): string => {
    const names: Record<Language, string> = {
      'pt-BR': 'Português',
      'en-US': 'English',
      'es-ES': 'Español',
    };
    return names[lang];
  };

  const handleNotificationsChange = (enabled: boolean) => {
    updateSettings({ notifications: enabled });
  };

  const handleAutoSaveChange = (enabled: boolean) => {
    updateSettings({ autoSave: enabled });
  };

  const handleSaveSettings = () => {
    showSuccess(t.settings.savedSuccess);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getThemeIcon = () => {
    switch (settings.theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{t.settings.title}</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* User Info */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t.settings.profile}
              </CardTitle>
              <CardDescription>
                {t.settings.profileDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.phone && (
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  )}
                </div>
                <div> 
                    <p className="font-medium text-foreground">{t.plans.currentPlan}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {t.auth.logout}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getThemeIcon()}
              {t.settings.appearance}
            </CardTitle>
            <CardDescription>
              {t.settings.appearanceDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">{t.settings.theme}</Label>
                <p className="text-sm text-muted-foreground">
                 {t.settings.themeDescription}
                </p>
              </div>
              <Select value={settings.theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      {t.settings.themeLight}
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      {t.settings.themeDark}
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      {t.settings.themeSystem}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t.settings.language}
            </CardTitle>
            <CardDescription>
              {t.settings.languageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="language">{t.settings.language}</Label>
                <p className="text-sm text-muted-foreground">
                  {t.settings.languageInstruction}
                </p>
              </div>
              <Select 
                value={settings.language} 
                onValueChange={(value) => handleLanguageChange(value as Language)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">
                    <div className="flex items-center gap-2">
                      🇧🇷 Português (BR)
                    </div>
                  </SelectItem>
                  <SelectItem value="en-US">
                    <div className="flex items-center gap-2">
                      🇺🇸 English (US)
                    </div>
                  </SelectItem>
                  <SelectItem value="es-ES">
                    <div className="flex items-center gap-2">
                      🇪🇸 Español
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {settings.notifications ? (
                <Bell className="h-5 w-5" />
              ) : (
                <BellOff className="h-5 w-5" />
              )}
              {t.settings.notifications}
            </CardTitle>
            <CardDescription>
              {t.settings.notificationDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">{t.settings.enableNotifications}</Label>
                <p className="text-sm text-muted-foreground">
                  {t.settings.notificationAlert}
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={handleNotificationsChange}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoSave">{t.settings.autoSave}</Label>
                <p className="text-sm text-muted-foreground">
                  {t.settings.saveAlert}
                </p>
              </div>
              <Switch
                id="autoSave"
                checked={settings.autoSave}
                onCheckedChange={handleAutoSaveChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="gap-2">
            <Save className="h-4 w-4" />
            {t.common.save}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;