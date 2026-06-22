// src/components/LanguageSwitcher.jsx
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'EN', flag: '🇬🇧' },
    { code: 'th', name: 'TH', flag: '🇹🇭' },
    { code: 'ru', name: 'RU', flag: '🇷🇺' }
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
            language === lang.code
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.name}
        </button>
      ))}
    </div>
  );
}