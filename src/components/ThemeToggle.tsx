import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ThemeToggleProps {
  variant?: 'select' | 'button';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'button',
  className = ''
}) => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const themeOptions = [
    { value: 'light', label: t('common.light'), icon: Sun },
    { value: 'dark', label: t('common.dark'), icon: Moon },
    { value: 'system', label: t('common.system'), icon: Monitor },
  ];

  const currentTheme = themeOptions.find(option => option.value === theme);

  if (variant === 'button') {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`gap-2 ${className}`}
        onClick={() => {
          const themes = ['light', 'dark', 'system'] as const;
          const currentIndex = themes.indexOf(theme);
          const nextIndex = (currentIndex + 1) % themes.length;
          setTheme(themes[nextIndex]);
        }}
      >
        {currentTheme && <currentTheme.icon className="w-4 h-4" />}
        <span className="hidden sm:inline">{currentTheme?.label}</span>
      </Button>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select
        value={theme}
        onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue>
            <div className="flex items-center gap-2">
              {currentTheme && <currentTheme.icon className="w-4 h-4" />}
              <span className="hidden sm:inline">{currentTheme?.label}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {themeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <option.icon className="w-4 h-4" />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};