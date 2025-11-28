import React from 'react';
import { School, BookOpen, Phone, Globe, Facebook, MapPin, GraduationCap, X, User, ExternalLink } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-dut-dark text-lg">
            <School className="text-dut-blue" />
            <span>DUT Assistant</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Section: Quick Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Thông tin chung</h3>
            <a href="http://dut.udn.vn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 text-slate-600 hover:bg-dut-light hover:text-dut-blue rounded-lg transition-colors text-sm font-medium">
              <Globe size={18} />
              Website chính thức
            </a>
            <a href="http://tuyensinh.dut.udn.vn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 text-slate-600 hover:bg-dut-light hover:text-dut-blue rounded-lg transition-colors text-sm font-medium">
              <GraduationCap size={18} />
              Cổng tuyển sinh
            </a>
            <a href="https://sv.dut.udn.vn/Default.aspx" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 text-slate-600 hover:bg-dut-light hover:text-dut-blue rounded-lg transition-colors text-sm font-medium">
              <User size={18} />
              Trang thông tin Sinh viên
            </a>
            <a href="http://dut.udn.vn/daotao" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 text-slate-600 hover:bg-dut-light hover:text-dut-blue rounded-lg transition-colors text-sm font-medium">
              <BookOpen size={18} />
              Chương trình đào tạo
            </a>
          </div>

          {/* Section: Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Liên hệ</h3>
            <div className="flex items-start gap-3 p-2 text-slate-600 text-sm">
              <MapPin size={18} className="shrink-0 mt-0.5" />
              <span>54 Nguyễn Lương Bằng, Q. Liên Chiểu, TP. Đà Nẵng</span>
            </div>
            <div className="flex items-center gap-3 p-2 text-slate-600 text-sm">
              <Phone size={18} />
              <span>0236 3842 308</span>
            </div>
            <a href="https://www.facebook.com/bachkhoaDUT" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 text-slate-600 hover:text-blue-600 transition-colors text-sm">
              <Facebook size={18} />
              Fanpage DUT
            </a>
          </div>

          {/* Banner */}
          <a 
            href="http://tuyensinh.dut.udn.vn" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-auto block bg-gradient-to-br from-dut-blue to-dut-dark rounded-xl p-4 text-white relative overflow-hidden group hover:shadow-lg transition-all"
          >
             <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <School size={80} />
             </div>
             <h4 className="font-bold mb-1 relative z-10 flex items-center gap-2">
               Tuyển sinh 2025
               <ExternalLink size={14} className="opacity-70" />
             </h4>
             <p className="text-xs text-blue-100 relative z-10 mb-3">Tìm hiểu thông tin xét tuyển sớm ngay hôm nay.</p>
             <div className="inline-block text-xs bg-white text-dut-blue px-3 py-1.5 rounded-lg font-semibold shadow-sm group-hover:shadow-md transition-all relative z-10">
               Xem chi tiết
             </div>
          </a>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400">
                Powered by Gemini API <br/> 
                © 2025 DUT Unofficial Helper
            </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;