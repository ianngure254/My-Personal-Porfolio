import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {}

const PHONE_NUMBER = '254792514301'
const DEFAULT_MESSAGE = "Hi Ian! I came across your portfolio and I'm interested in working with you."
const WHATSAPP_URL = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

const WhatsAppButton = (_props: WhatsAppButtonProps) => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20ba5a] hover:scale-110 transition-all duration-300 z-999 group flex items-center gap-2"
    aria-label="Chat on WhatsApp"
  >
    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-medium text-sm">
      Chat with me
    </span>

    <MessageCircle size={28} fill="currentColor" className="text-white shrink-0" />

    <span className="absolute top-0 right-0 flex h-4 w-4" aria-hidden="true">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-100 border-2 border-[#25D366]" />
    </span>
  </a>
)

export default WhatsAppButton
