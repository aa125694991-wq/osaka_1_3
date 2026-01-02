import React, { useState } from 'react';
import { ScheduleEvent, WeatherInfo, Category } from '../types';

const INITIAL_EVENTS: ScheduleEvent[] = [
  { id: '1', date: '2024-11-15', time: '10:00', title: '抵達關西機場 (KIX)', location: { name: 'Kansai Airport' }, category: 'transport', notes: '搭乘 Haruka前往京都', reservationNumber: 'RES-998877' },
  { id: '2', date: '2024-11-15', time: '13:00', title: '京都車站拉麵小路', location: { name: 'Kyoto Station' }, category: 'food' },
  { id: '3', date: '2024-11-15', time: '15:00', title: 'Check-in 飯店', location: { name: 'Piece Hostel Sanjo' }, category: 'accommodation', reservationNumber: 'BK-2024-XYZ' },
  { id: '4', date: '2024-11-15', time: '16:30', title: '清水寺夕陽', location: { name: 'Kiyomizu-dera' }, category: 'sightseeing', photos: ['https://picsum.photos/400/300'] },
  { id: '5', date: '2024-11-16', time: '09:00', title: '伏見稻荷大社', location: { name: 'Fushimi Inari' }, category: 'sightseeing' },
  { id: '6', date: '2024-11-16', time: '12:00', title: '錦市場午餐', location: { name: 'Nishiki Market' }, category: 'food', reservationNumber: 'Lunch-001' },
];

const MOCK_WEATHER: Record<string, WeatherInfo> = {
  '2024-11-15': { date: '2024-11-15', condition: 'sunny', tempMin: 12, tempMax: 19 },
  '2024-11-16': { date: '2024-11-16', condition: 'cloudy', tempMin: 10, tempMax: 17 },
  '2024-11-17': { date: '2024-11-17', condition: 'rainy', tempMin: 9, tempMax: 15 },
  '2024-11-18': { date: '2024-11-18', condition: 'sunny', tempMin: 11, tempMax: 20 },
  '2024-11-19': { date: '2024-11-19', condition: 'sunny', tempMin: 11, tempMax: 20 },
};

const INITIAL_DATES = ['2024-11-15', '2024-11-16', '2024-11-17', '2024-11-18', '2024-11-19'];

const CATEGORY_COLORS: Record<Category, string> = {
  sightseeing: 'bg-ios-indigo text-white',
  food: 'bg-ios-orange text-white',
  transport: 'bg-ios-green text-white',
  accommodation: 'bg-ios-pink text-white',
  shopping: 'bg-ios-blue text-white'
};

const CATEGORY_LABELS: Record<Category, string> = {
  sightseeing: '觀光',
  food: '美食',
  transport: '交通',
  accommodation: '住宿',
  shopping: '購物'
};

const CATEGORY_ICONS: Record<Category, string> = {
  sightseeing: 'fa-camera',
  food: 'fa-utensils',
  transport: 'fa-train-subway',
  accommodation: 'fa-bed',
  shopping: 'fa-bag-shopping'
};

const ScheduleView: React.FC = () => {
  const [dates, setDates] = useState<string[]>(INITIAL_DATES);
  const [events, setEvents] = useState<ScheduleEvent[]>(INITIAL_EVENTS);
  const [selectedDate, setSelectedDate] = useState<string>(dates[0]);
  
  // Modal State
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ScheduleEvent>>({});

  const currentEvents = events.filter(e => e.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time));
  const weather = MOCK_WEATHER[selectedDate];

  const getWeatherIcon = (condition?: string) => {
    switch(condition) {
      case 'sunny': return 'fa-sun text-ios-orange';
      case 'rainy': return 'fa-cloud-rain text-ios-blue';
      case 'cloudy': return 'fa-cloud text-gray-400';
      default: return 'fa-sun text-gray-300';
    }
  };

  const handleAddDate = () => {
    const lastDate = dates[dates.length - 1];
    const newDateObj = new Date(lastDate);
    newDateObj.setDate(newDateObj.getDate() + 1);
    const newDateStr = newDateObj.toISOString().split('T')[0];
    setDates([...dates, newDateStr]);
  };

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setEditForm(event);
    setIsEditing(false);
  };

  const handleAddNewEvent = () => {
    const newEvent: ScheduleEvent = {
      id: Date.now().toString(),
      date: selectedDate,
      time: '12:00',
      title: '新行程',
      location: { name: '' },
      category: 'sightseeing',
      notes: '',
      reservationNumber: ''
    };
    setSelectedEvent(newEvent);
    setEditForm(newEvent);
    setIsEditing(true);
  };

  const handleSaveEvent = () => {
    if (!editForm.title || !selectedEvent) return;
    
    const updatedEvent = {
       ...selectedEvent,
       ...editForm,
       location: { ...selectedEvent.location, name: editForm.location?.name || '' }
    } as ScheduleEvent;

    setEvents(prev => {
      const exists = prev.find(e => e.id === updatedEvent.id);
      if (exists) {
        return prev.map(e => e.id === updatedEvent.id ? updatedEvent : e);
      }
      return [...prev, updatedEvent];
    });

    setSelectedEvent(null);
    setIsEditing(false);
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
    setSelectedEvent(null);
  };

  return (
    <div className="flex flex-col h-full bg-ios-bg">
      {/* Header & Date Picker */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200">
        <div className="px-6 pt-4 pb-2 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">行程 Schedule</h1>
            <p className="text-xs text-gray-500 mt-1"><i className="fa-solid fa-location-dot mr-1"></i> 大阪 & 京都</p>
          </div>
          <button 
            onClick={handleAddNewEvent} 
            className="w-8 h-8 rounded-full bg-ios-blue text-white flex items-center justify-center shadow-md active:scale-90 transition-transform"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar px-4 pb-3 gap-3 snap-x">
          {dates.map((date) => {
            const day = new Date(date).getDate();
            const w = MOCK_WEATHER[date];
            const isSelected = date === selectedDate;
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 snap-start flex flex-col items-center justify-center w-16 h-20 rounded-2xl border transition-all duration-200 active:scale-95 ${
                  isSelected 
                    ? 'bg-ios-blue border-ios-blue text-white shadow-ios-md' 
                    : 'bg-white border-gray-100 text-gray-600'
                }`}
              >
                <span className="text-xs font-medium uppercase opacity-80">Nov</span>
                <span className="text-xl font-bold">{day}</span>
                <i className={`fa-solid ${getWeatherIcon(w?.condition)} text-[10px] mt-1 ${isSelected ? 'text-white' : ''}`}></i>
              </button>
            );
          })}
          <button 
             onClick={handleAddDate}
             className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl border border-dashed border-gray-300 text-gray-400 active:bg-gray-50"
          >
             <i className="fa-solid fa-plus text-xl"></i>
             <span className="text-[10px] mt-1">新增天數</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 space-y-6">
        {/* Weather Summary Card */}
        {weather && (
          <div className="bg-white rounded-2xl p-4 shadow-ios-sm flex items-center justify-between border border-gray-100">
             <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-xl`}>
                   <i className={`fa-solid ${getWeatherIcon(weather.condition)}`}></i>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 capitalize">{weather.condition}</p>
                  <p className="text-xs text-gray-500">預報天氣狀況</p>
                </div>
             </div>
             <div className="text-right">
                <span className="text-lg font-bold text-gray-900">{weather.tempMax}°</span>
                <span className="text-sm text-gray-400 mx-1">/</span>
                <span className="text-sm text-gray-500">{weather.tempMin}°</span>
             </div>
          </div>
        )}

        {/* Timeline */}
        <div className="relative pl-4 border-l-2 border-gray-200 ml-4 space-y-8">
          {currentEvents.map((event) => (
            <div key={event.id} className="relative group cursor-pointer" onClick={() => handleEventClick(event)}>
              {/* Dot */}
              <div className={`absolute -left-[25px] w-4 h-4 rounded-full border-2 border-white ring-2 ring-gray-100 ${CATEGORY_COLORS[event.category].split(' ')[0]}`}></div>
              
              {/* Card */}
              <div className="bg-white rounded-xl p-4 shadow-ios-sm border border-gray-100 transition-transform active:scale-[0.98]">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-sm font-semibold text-gray-400 font-mono tracking-tight">{event.time}</span>
                   <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[event.category]}`}>
                      <i className={`fa-solid ${CATEGORY_ICONS[event.category]} mr-1`}></i>
                      {CATEGORY_LABELS[event.category]}
                   </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                
                {/* Visible Reservation Number */}
                {event.reservationNumber && (
                   <div className="inline-flex items-center bg-gray-50 border border-gray-200 rounded px-2 py-0.5 mb-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase mr-1">No.</span>
                      <span className="text-xs font-mono font-medium text-gray-800">{event.reservationNumber}</span>
                   </div>
                )}

                <div className="flex items-center text-gray-500 text-sm">
                   <i className="fa-solid fa-location-dot mr-1.5 text-ios-red w-4 text-center"></i>
                   <span className="truncate">{event.location.name || '未設定地點'}</span>
                </div>
              </div>
            </div>
          ))}
          
          {currentEvents.length === 0 && (
             <div className="text-center py-10 text-gray-400">
                <i className="fa-regular fa-calendar-xmark text-3xl mb-2"></i>
                <p>這一天沒有安排行程</p>
                <button onClick={handleAddNewEvent} className="mt-4 text-ios-blue text-sm font-semibold">
                  + 新增行程
                </button>
             </div>
          )}
        </div>
      </div>

      {/* Detail/Edit Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full max-w-md h-[90vh] sm:h-auto sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col animate-[slideUp_0.3s_ease-out]">
            {/* Header Image or Map Placeholder */}
            {!isEditing && (
              <div className="h-40 bg-gray-200 relative shrink-0">
                 {selectedEvent.photos ? (
                    <img src={selectedEvent.photos[0]} className="w-full h-full object-cover" alt="spot" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-ios-indigo/10 text-ios-indigo">
                      <i className="fa-solid fa-map text-4xl"></i>
                    </div>
                 )}
                 <button 
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full w-8 h-8 flex items-center justify-center text-gray-600 shadow-sm active:scale-90 transition-transform"
                 >
                   <i className="fa-solid fa-xmark"></i>
                 </button>
              </div>
            )}

            <div className="p-6 flex-1 overflow-y-auto">
               {isEditing ? (
                 <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                       <h2 className="text-xl font-bold">編輯行程</h2>
                       <button onClick={() => setIsEditing(false)} className="text-gray-400">取消</button>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">標題</label>
                      <input 
                        className="w-full border-b border-gray-200 py-2 text-lg font-bold outline-none focus:border-ios-blue"
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">日期</label>
                        <select 
                          className="w-full border-b border-gray-200 py-2 bg-transparent outline-none"
                          value={editForm.date}
                          onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                        >
                           {dates.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">時間</label>
                        <input 
                          type="time"
                          className="w-full border-b border-gray-200 py-2 outline-none"
                          value={editForm.time}
                          onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">類別</label>
                      <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar py-1">
                        {Object.keys(CATEGORY_COLORS).map((cat) => (
                           <button
                             key={cat}
                             onClick={() => setEditForm({...editForm, category: cat as Category})}
                             className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-colors ${
                               editForm.category === cat 
                               ? CATEGORY_COLORS[cat as Category] 
                               : 'bg-gray-100 text-gray-500'
                             }`}
                           >
                             {CATEGORY_LABELS[cat as Category]}
                           </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">地點</label>
                      <input 
                        className="w-full border-b border-gray-200 py-2 outline-none"
                        value={editForm.location?.name}
                        onChange={(e) => setEditForm({...editForm, location: {name: e.target.value}})}
                        placeholder="輸入地點名稱"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">預約編號</label>
                      <input 
                        className="w-full bg-gray-50 rounded-lg px-3 py-2 mt-1 outline-none border border-transparent focus:border-ios-blue focus:bg-white transition-colors"
                        value={editForm.reservationNumber || ''}
                        onChange={(e) => setEditForm({...editForm, reservationNumber: e.target.value})}
                        placeholder="例如: BK-2024-888"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">備註</label>
                      <textarea 
                        className="w-full bg-gray-50 rounded-lg px-3 py-2 mt-1 outline-none border border-transparent focus:border-ios-blue focus:bg-white transition-colors h-24 resize-none"
                        value={editForm.notes || ''}
                        onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                      />
                    </div>

                    <div className="pt-4 flex gap-3">
                       {selectedEvent.id && (
                          <button onClick={handleDeleteEvent} className="flex-1 bg-red-100 text-red-600 py-3 rounded-xl font-bold text-sm">
                             刪除
                          </button>
                       )}
                       <button onClick={handleSaveEvent} className="flex-[2] bg-ios-blue text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-200">
                          儲存
                       </button>
                    </div>
                 </div>
               ) : (
                 <>
                   <span className={`text-xs font-bold uppercase tracking-wider ${CATEGORY_COLORS[selectedEvent.category].replace('text-white', 'text-ios-blue bg-transparent')}`}>
                     {CATEGORY_LABELS[selectedEvent.category]}
                   </span>
                   <h2 className="text-2xl font-bold mt-1 mb-4 text-gray-900">{selectedEvent.title}</h2>
                   
                   <div className="space-y-4">
                      {selectedEvent.reservationNumber && (
                        <div className="bg-ios-indigo/5 border border-ios-indigo/10 rounded-xl p-3 flex items-center justify-between">
                           <div>
                              <p className="text-[10px] uppercase font-bold text-ios-indigo mb-0.5">預約編號 (No.)</p>
                              <p className="font-mono font-bold text-lg text-gray-800 tracking-wide">{selectedEvent.reservationNumber}</p>
                           </div>
                           <button className="text-ios-indigo bg-white p-2 rounded-lg shadow-sm text-xs">
                              <i className="fa-regular fa-copy"></i>
                           </button>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <i className="fa-regular fa-clock mt-1 text-gray-400"></i>
                        <div>
                          <p className="text-gray-900 font-medium">{selectedEvent.date}</p>
                          <p className="text-gray-500 text-sm">{selectedEvent.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <i className="fa-solid fa-location-dot mt-1 text-gray-400"></i>
                        <div>
                          <p className="text-gray-900 font-medium">{selectedEvent.location.name}</p>
                          <button className="text-ios-blue text-sm font-medium mt-1 active:opacity-60">
                             在 Google Maps 開啟
                          </button>
                        </div>
                      </div>

                      {selectedEvent.notes && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                           <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">備註</h4>
                           <p className="text-gray-700 text-sm leading-relaxed">{selectedEvent.notes}</p>
                        </div>
                      )}

                      <div className="pt-4 flex gap-3">
                        <button 
                          onClick={() => { setIsEditing(true); setEditForm(selectedEvent); }}
                          className="flex-1 bg-ios-blue text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 active:scale-95 transition-transform"
                        >
                          <i className="fa-solid fa-pen mr-2"></i> 編輯
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform">
                           <i className="fa-solid fa-camera mr-2"></i> 上傳照片
                        </button>
                      </div>
                   </div>
                 </>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;