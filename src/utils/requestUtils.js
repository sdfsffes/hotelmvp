// src/utils/requestUtils.js - добавьте эту функцию

/**
 * Генерация кода бронирования в формате BBQ-1205-4821
 * @param {string} serviceCode - Код услуги (BBQ, SPA, BOAT и т.д.)
 * @returns {string} Код бронирования формата BBQ-1205-4821
 */
export const generateBookingCode = (serviceCode) => {
  // Получаем текущую дату
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Генерируем 4-значный случайный номер
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  // Формат: BBQ-1205-4821 (BBQ-день.месяц-случайный)
  return `${serviceCode}-${day}${month}-${random}`;
};