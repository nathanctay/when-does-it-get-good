import React, { useState } from 'react'
import { Loader2, Check, AlertCircle } from 'lucide-react'

export default function FeedbackForm() {
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(null)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, message })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({ type: 'success', text: 'FEEDBACK RECEIVED. THANK YOU!' })
        setEmail('')
        setSubject('')
        setMessage('')
      } else {
        setStatus({ type: 'error', text: data.error || 'SUBMISSION ERROR' })
      }
    } catch (error) {
      setStatus({ type: 'error', text: 'NETWORK ERROR. PLEASE RETRY.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-xs font-black text-slate-500 uppercase tracking-widest">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full bg-white border border-slate-300 rounded-sm py-2 px-3 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="your@email.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="block text-xs font-black text-slate-500 uppercase tracking-widest">
          Subject (Optional)
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="block w-full bg-white border border-slate-300 rounded-sm py-2 px-3 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="What's this about?"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-xs font-black text-slate-500 uppercase tracking-widest">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="block w-full bg-white border border-slate-300 rounded-sm py-2 px-3 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
          placeholder="Your feedback, bug reports, or feature requests..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-700 hover:bg-blue-600 text-white font-black py-3 px-6 rounded-sm text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          'Send Feedback'
        )}
      </button>

      {status && (
        <div className={`p-4 rounded-sm flex items-start gap-3 border ${
          status.type === 'success' 
            ? 'bg-green-500 border-green-600 text-white' 
            : 'bg-red-500 border-red-600 text-white'
        }`}>
          {status.type === 'success' ? <Check className="h-4 w-4 flex-shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
          <p className="text-[10px] font-black uppercase tracking-wider">{status.text}</p>
        </div>
      )}
    </form>
  )
}
