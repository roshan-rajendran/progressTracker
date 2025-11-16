import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface SidebarCalendarProps {
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
  datesWithTasks: Set<string>;
}

const SidebarCalendar: React.FC<SidebarCalendarProps> = ({ onSelectDate, selectedDate, datesWithTasks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  useEffect(() => {
    setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  }, [selectedDate]);

  const changeMonth = (amount: number) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + amount);
      return newMonth;
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Padding for days before the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-start-${i}`} className="w-8 h-8"></div>);
    }

    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      
      const isToday = date.getTime() === today.getTime();
      const isSelected = date.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
      const hasTasks = datesWithTasks.has(dateString);

      const dayClasses = `
        w-8 h-8 flex items-center justify-center rounded-full text-sm cursor-pointer transition-colors duration-200 relative
        ${isSelected ? 'bg-primary text-white font-semibold' : ''}
        ${!isSelected && isToday ? 'bg-primary/20 text-primary dark:text-purple-300' : ''}
        ${!isSelected && !isToday ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' : ''}
      `;

      days.push(
        <button key={day} onClick={() => onSelectDate(date)} className={dayClasses}>
          {day}
          {hasTasks && <span className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`}></span>}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h4>
        <div>
          <button onClick={() => changeMonth(-1)} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronLeftIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <button onClick={() => changeMonth(1)} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronRightIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default SidebarCalendar;