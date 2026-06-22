// src/context/LanguageContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

// Базовые переводы
const translations = {
  en: {
    // Header
    home: "Home",
    experiences: "Experiences",
    admin: "Admin",
    bookNow: "BOOK NOW",
    // Hero
    heroBadge: "MÖVENPICK SIAM HOTEL",
    heroTitle: "Family Paradise in Pattaya",
    heroSubtitle: "Welcome to Na Jomtien Beach, home of Mövenpick Siam Hotel. A beachfront resort featuring sea view rooms, a lagoon pool, spa, and warm Swiss hospitality.",
    exploreExperiences: "Explore Experiences",
    viewServices: "View Services",
    elegantRooms: "Elegant Rooms",
    fromBangkok: "from Bangkok",
    guestRating: "Guest Rating",
    // Experience
    experience: "EXPERIENCE",
    experienceTitle: "Your Family Escape by the Sea",
    experienceDesc: "Nestled in one of Pattaya's most peaceful coastal areas, this beachfront resort features sea view rooms, a lagoon pool, spa, and warm Swiss hospitality. Just 2 hours from Bangkok, it's a perfect escape for your next seaside retreat.",
    // Dining
    dining: "DINING",
    diningTitle: "Restaurants & Bars",
    diningDesc: "Discover where the best restaurants gather to provide a rich and flavorful dining journey",
    learnMore: "Learn more",
    // Rooms
    accommodation: "ACCOMMODATION",
    roomsTitle: "Rooms & Suites",
    roomsDesc: "Find your perfect accommodation in Pattaya with stunning sea views from private balconies",
    viewDetails: "View Details",
    // Why Choose Us
    whyChoose: "Why Choose Movenpick",
    whyChooseDesc: "Life tastes better at Movenpick Pattaya",
    panoramicViews: "Panoramic Views",
    panoramicDesc: "Every room offers stunning sea views from private balconies",
    beachfront: "Pristine Beachfront",
    beachfrontDesc: "Step directly onto the quiet sands of Na Jomtien Beach",
    chocolate: "Free Chocolate Hour",
    chocolateDesc: "60 minutes of daily bliss — joy served daily",
    familyFirst: "Family First",
    familyDesc: "Activities for all ages with our Little Bird Kid's Club",
    // Offers
    offers: "OFFERS",
    offersTitle: "Double the Joy",
    offersDesc: "Save up to 25% on your next coastal escape",
    off: "OFF",
    stayMoment: "Stay in the Moment",
    validUntil: "Valid for stays until 30 September 2026",
    seaView: "Sea View Rooms",
    // Wedding
    wedding: "WEDDING",
    weddingTitle: "The Perfect Backdrop for Your 'I Do'",
    weddingDesc: "Imagine exchanging vows as the sun dips below the horizon, painting the sky in hues of gold and amber. Our spacious, pristine beachfront lawn offers a romantic sanctuary for your special day.",
    versatileSpaces: "Versatile Event Spaces — up to 300 guests",
    romanticAmbience: "Romantic Ambience with stunning sea views",
    weddingPlanner: "Professional Wedding Planner included",
    planWedding: "Plan Your Wedding →",
    // Services
    servicesAvailable: "luxury experiences available",
    noServices: "No services found",
    tryDifferent: "Try selecting a different category",
    viewAll: "View all services →",
    // Categories
    allServices: "All Services",
    wellness: "Wellness",
    adventure: "Adventure",
    activities: "Activities",
    family: "Family",
    // Footer
    quickLinks: "Quick Links",
    roomsSuites: "Rooms & Suites",
    restaurants: "Restaurants",
    weddings: "Weddings",
    offersLink: "Offers",
    facilities: "Facilities",
    contact: "Contact",
    newsletter: "Newsletter",
    subscribe: "Subscribe for exclusive offers",
    yourEmail: "Your email",
    getOffer: "Get 10% off your first stay",
    copyright: "© 2024 Movenpick Siam Hotel Na Jomtien Pattaya. All rights reserved.",
    crafted: "Crafted with excellence for unforgettable moments"
  },
  th: {
    home: "หน้าหลัก",
    experiences: "ประสบการณ์",
    admin: "ผู้ดูแลระบบ",
    bookNow: "จองเลย",
    heroBadge: "โรงแรมโมเวนพิค สยาม",
    heroTitle: "สวรรค์ของครอบครัวในพัทยา",
    heroSubtitle: "ยินดีต้อนรับสู่หาดนาจอมเทียน บ้านของโรงแรมโมเวนพิค สยาม รีสอร์ทริมทะเลพร้อมห้องพักวิวทะเล สระว่ายน้ำ สปา และการต้อนรับแบบสวิส",
    exploreExperiences: "สำรวจประสบการณ์",
    viewServices: "ดูบริการ",
    elegantRooms: "ห้องพักหรู",
    fromBangkok: "จากกรุงเทพฯ",
    guestRating: "คะแนนจากผู้เข้าพัก",
    experience: "ประสบการณ์",
    experienceTitle: "การพักผ่อนของครอบครัวริมทะเล",
    experienceDesc: "ตั้งอยู่ในพื้นที่ชายฝั่งที่เงียบสงบที่สุดแห่งหนึ่งของพัทยา รีสอร์ทริมทะเลแห่งนี้มีห้องพักวิวทะเล สระว่ายน้ำ สปา และการต้อนรับแบบสวิส เพียง 2 ชั่วโมงจากกรุงเทพฯ",
    dining: "อาหาร",
    diningTitle: "ร้านอาหารและบาร์",
    diningDesc: "ค้นพบร้านอาหารที่ดีที่สุดในพัทยา",
    learnMore: "เรียนรู้เพิ่มเติม",
    accommodation: "ที่พัก",
    roomsTitle: "ห้องพักและสวีท",
    roomsDesc: "ค้นหาที่พักที่สมบูรณ์แบบในพัทยาพร้อมวิวทะเลจากระเบียงส่วนตัว",
    viewDetails: "ดูรายละเอียด",
    whyChoose: "ทำไมต้องเลือกโมเวนพิค",
    whyChooseDesc: "ชีวิตดีกว่าเมื่ออยู่ที่โมเวนพิค พัทยา",
    panoramicViews: "วิวพาโนรามา",
    panoramicDesc: "ทุกห้องมีวิวทะเลที่สวยงามจากระเบียงส่วนตัว",
    beachfront: "ชายหาดที่บริสุทธิ์",
    beachfrontDesc: "ก้าวลงสู่หาดนาจอมเทียนได้โดยตรง",
    chocolate: "ชั่วโมงช็อคโกแลตฟรี",
    chocolateDesc: "60 นาทีแห่งความสุขทุกวัน",
    familyFirst: "ครอบครัวมาก่อน",
    familyDesc: "กิจกรรมสำหรับทุกวัยกับ Little Bird Kid's Club",
    offers: "ข้อเสนอ",
    offersTitle: "ความสุขเป็นสองเท่า",
    offersDesc: "ประหยัดสูงสุด 25% สำหรับการพักผ่อนริมทะเลครั้งต่อไป",
    off: "ลด",
    stayMoment: "อยู่กับช่วงเวลา",
    validUntil: "ใช้ได้จนถึง 30 กันยายน 2026",
    seaView: "ห้องพักวิวทะเล",
    wedding: "งานแต่งงาน",
    weddingTitle: "ฉากหลังที่สมบูรณ์แบบสำหรับ 'I Do' ของคุณ",
    weddingDesc: "จินตนาการถึงการกล่าวคำมั่นสัญญาท่ามกลางพระอาทิตย์ตกดิน ท้องฟ้าสีทอง และชายหาดส่วนตัว",
    versatileSpaces: "พื้นที่จัดงานอเนกประสงค์ — รองรับได้ถึง 300 ท่าน",
    romanticAmbience: "บรรยากาศโรแมนติกพร้อมวิวทะเล",
    weddingPlanner: "มีผู้วางแผนงานแต่งงานมืออาชีพ",
    planWedding: "วางแผนงานแต่งงานของคุณ →",
    servicesAvailable: "ประสบการณ์หรูหราพร้อมให้บริการ",
    noServices: "ไม่พบบริการ",
    tryDifferent: "ลองเลือกหมวดหมู่อื่น",
    viewAll: "ดูบริการทั้งหมด →",
    allServices: "บริการทั้งหมด",
    wellness: "สุขภาพและสปา",
    adventure: "การผจญภัย",
    activities: "กิจกรรม",
    family: "ครอบครัว",
    quickLinks: "ลิงก์ด่วน",
    roomsSuites: "ห้องพักและสวีท",
    restaurants: "ร้านอาหาร",
    weddings: "งานแต่งงาน",
    offersLink: "ข้อเสนอ",
    facilities: "สิ่งอำนวยความสะดวก",
    contact: "ติดต่อ",
    newsletter: "จดหมายข่าว",
    subscribe: "สมัครรับข้อเสนอพิเศษ",
    yourEmail: "อีเมลของคุณ",
    getOffer: "รับส่วนลด 10% สำหรับการเข้าพักครั้งแรก",
    copyright: "© 2024 โรงแรมโมเวนพิค สยาม นาจอมเทียน พัทยา สงวนลิขสิทธิ์",
    crafted: "สร้างด้วยความเป็นเลิศเพื่อช่วงเวลาที่น่าจดจำ"
  },
  ru: {
    home: "Главная",
    experiences: "Впечатления",
    admin: "Админ",
    bookNow: "ЗАБРОНИРОВАТЬ",
    heroBadge: "ОТЕЛЬ MOVENPICK SIAM",
    heroTitle: "Рай для семьи в Паттайе",
    heroSubtitle: "Добро пожаловать на пляж На Джомтьен, дом отеля Movenpick Siam. Курорт на побережье с номерами с видом на море, лагуной, спа и швейцарским гостеприимством.",
    exploreExperiences: "Изучить впечатления",
    viewServices: "Посмотреть услуги",
    elegantRooms: "Элегантных номеров",
    fromBangkok: "от Бангкока",
    guestRating: "Рейтинг гостей",
    experience: "ВПЕЧАТЛЕНИЯ",
    experienceTitle: "Ваш семейный отдых у моря",
    experienceDesc: "Расположенный в одной из самых спокойных прибрежных зон Паттайи, этот курорт на побережье предлагает номера с видом на море, лагунный бассейн, спа и швейцарское гостеприимство. Всего в 2 часах от Бангкока.",
    dining: "РЕСТОРАНЫ",
    diningTitle: "Рестораны и бары",
    diningDesc: "Откройте для себя лучшие рестораны Паттайи",
    learnMore: "Узнать больше",
    accommodation: "ПРОЖИВАНИЕ",
    roomsTitle: "Номера и люксы",
    roomsDesc: "Найдите идеальное размещение в Паттайе с потрясающим видом на море с частных балконов",
    viewDetails: "Подробнее",
    whyChoose: "Почему выбирают Movenpick",
    whyChooseDesc: "Жизнь становится лучше в Movenpick Pattaya",
    panoramicViews: "Панорамные виды",
    panoramicDesc: "Каждый номер предлагает потрясающий вид на море с частного балкона",
    beachfront: "Первоклассный пляж",
    beachfrontDesc: "Прямой выход на тихий пляж На Джомтьен",
    chocolate: "Бесплатный шоколадный час",
    chocolateDesc: "60 минут ежедневного блаженства",
    familyFirst: "Семья прежде всего",
    familyDesc: "Развлечения для всех возрастов в детском клубе Little Bird",
    offers: "ПРЕДЛОЖЕНИЯ",
    offersTitle: "Двойная радость",
    offersDesc: "Экономьте до 25% на следующем отдыхе у моря",
    off: "СКИДКА",
    stayMoment: "Наслаждайтесь моментом",
    validUntil: "Действительно до 30 сентября 2026",
    seaView: "Номера с видом на море",
    wedding: "СВАДЬБА",
    weddingTitle: "Идеальный фон для вашего 'Я согласен'",
    weddingDesc: "Представьте, как вы обмениваетесь клятвами на закате, когда небо окрашивается в золотые и янтарные тона. Наш просторный пляж предлагает романтическое убежище.",
    versatileSpaces: "Универсальные площадки — до 300 гостей",
    romanticAmbience: "Романтическая атмосфера с видом на море",
    weddingPlanner: "Профессиональный организатор свадьбы",
    planWedding: "Планируйте свадьбу →",
    servicesAvailable: "роскошных впечатлений доступно",
    noServices: "Услуги не найдены",
    tryDifferent: "Попробуйте выбрать другую категорию",
    viewAll: "Показать все услуги →",
    allServices: "Все услуги",
    wellness: "Оздоровление",
    adventure: "Приключения",
    activities: "Активности",
    family: "Семья",
    quickLinks: "Быстрые ссылки",
    roomsSuites: "Номера и люксы",
    restaurants: "Рестораны",
    weddings: "Свадьбы",
    offersLink: "Предложения",
    facilities: "Услуги",
    contact: "Контакты",
    newsletter: "Новостная рассылка",
    subscribe: "Подпишитесь на эксклюзивные предложения",
    yourEmail: "Ваш email",
    getOffer: "Получите 10% скидку на первое проживание",
    copyright: "© 2024 Отель Movenpick Siam Na Jomtien Pattaya. Все права защищены.",
    crafted: "Создано с совершенством для незабываемых моментов"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const getInitialLanguage = () => {
    const saved = localStorage.getItem('language');
    if (saved && translations[saved]) return saved;
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) return browserLang;
    return 'en';
  };

  const [language, setLanguage] = useState(getInitialLanguage);
  const [t, setT] = useState(translations[language]);

  useEffect(() => {
    localStorage.setItem('language', language);
    setT(translations[language]);
  }, [language]);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  const translate = (key, params = {}) => {
    let text = t[key] || key;
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}