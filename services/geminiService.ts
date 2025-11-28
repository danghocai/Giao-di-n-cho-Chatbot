import { GoogleGenAI, Chat } from "@google/genai";

// Initialize Gemini Client
// In a real production app, this should be handled carefully.
// Assuming process.env.API_KEY is available as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const DUT_SYSTEM_INSTRUCTION = `
Bạn là Trợ lý ảo AI chuyên trách tư vấn tuyển sinh cho Trường Đại học Bách khoa - Đại học Đà Nẵng (DUT - Da Nang University of Science and Technology).
Nhiệm vụ của bạn là giải đáp thắc mắc của học sinh, phụ huynh và sinh viên về các vấn đề liên quan đến nhà trường một cách thân thiện, chính xác và chuyên nghiệp.

Thông tin bối cảnh quan trọng:
- Tên trường: Trường Đại học Bách khoa - Đại học Đà Nẵng.
- Viết tắt: DUT hoặc ĐHBK-ĐHĐN.
- Màu sắc nhận diện: Xanh dương.
- Các nhóm ngành đào tạo chính: Công nghệ thông tin, Điện - Điện tử, Cơ khí, Xây dựng, Kiến trúc, Hóa học, Môi trường, Quản lý dự án, v.v.
- Phương thức tuyển sinh thường gặp: Xét tuyển thẳng, Xét kết quả thi THPT, Xét học bạ, Xét tuyển riêng.

Phong cách trả lời:
- Xưng hô: "Mình" (với bạn học sinh) hoặc "Ban tư vấn" (trang trọng hơn), gọi người dùng là "bạn" hoặc "quý phụ huynh" tùy ngữ cảnh.
- Giọng điệu: Nhiệt tình, khuyến khích, rõ ràng.
- Định dạng: Sử dụng Markdown (in đậm **từ khóa**, gạch đầu dòng) để dễ đọc.
- Nếu không biết chắc chắn thông tin (ví dụ: điểm chuẩn cụ thể của năm nay chưa công bố), hãy khuyên người dùng theo dõi website chính thức của trường (dut.udn.vn) hoặc fanpage tuyển sinh.

Tuyệt đối không bịa đặt số liệu cụ thể về học phí hoặc điểm chuẩn nếu không có trong dữ liệu huấn luyện chung, hãy đưa ra khoảng ước lượng hoặc hướng dẫn tra cứu.
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: DUT_SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balance between creative and factual
      },
    });
  }
  return chatSession;
};

export const resetChatSession = () => {
  chatSession = null;
  getChatSession(); // Re-initialize
};

export const sendMessageToGemini = async (
  message: string,
  onChunk: (text: string) => void
): Promise<void> => {
  const chat = getChatSession();
  
  try {
    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
